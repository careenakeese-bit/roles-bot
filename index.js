// ================= EXPRESS (KEEP ALIVE) =================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
console.log("Web server running");
});

// ================= DISCORD =================
const fs = require("fs");
const Discord = require("discord.js");

const {
Client,
GatewayIntentBits,
Partials,
ActionRowBuilder,
StringSelectMenuBuilder,
EmbedBuilder
} = Discord;

const { roles, reactionRolesPanels, channelId } = require("./config.js");

const MESSAGE_FILE = "./messages.json";

// ================= SAFE STORAGE =================
function loadMessages() {
try {
if (!fs.existsSync(MESSAGE_FILE)) return {};
return JSON.parse(fs.readFileSync(MESSAGE_FILE, "utf8"));
} catch {
return {};
}
}

function saveMessages(data) {
fs.writeFileSync(MESSAGE_FILE, JSON.stringify(data, null, 2));
}

// ================= CLIENT =================
const client = new Client({
intents: [
GatewayIntentBits.Guilds,
GatewayIntentBits.GuildMembers,
GatewayIntentBits.GuildMessages,
GatewayIntentBits.GuildMessageReactions
],
partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// ================= READY =================
client.once("ready", async () => {
console.log(`${client.user.tag} is online`);

const channel = await client.channels.fetch(channelId).catch(() => null);
if (!channel) return console.log("Channel not found");

const saved = loadMessages();

// ================= DROPDOWN =================
const embed = new EmbedBuilder()
.setTitle("🎮 Game Roles")
.setDescription("Select your games below")
.setColor("#ff0080");

const menu = new StringSelectMenuBuilder()
.setCustomId("roles_menu")
.setPlaceholder("Select games")
.setMaxValues(roles.length)
.addOptions(
roles.map(r => ({
label: r.label,
value: r.roleId,
emoji: r.emoji
}))
);

const row = new ActionRowBuilder().addComponents(menu);

// prevent duplicate dropdown spam
const recent = await channel.messages.fetch({ limit: 10 });
const exists = recent.some(
m => m.author.id === client.user.id && m.components.length > 0
);

if (!exists) {
await channel.send({ embeds: [embed], components: [row] });
}

// ================= REACTION ROLES =================
for (const panel of reactionRolesPanels) {
const ch = await client.channels.fetch(panel.channelId).catch(() => null);
if (!ch) continue;

let desc = "";
for (const [emoji, data] of Object.entries(panel.roles)) {
desc += `${emoji} ${data.label}\n`;
}

const rrEmbed = new EmbedBuilder()
.setTitle(panel.title)
.setDescription(desc)
.setColor(panel.color);

let msg;

try {
if (saved[panel.title]) {
msg = await ch.messages.fetch(saved[panel.title]);
await msg.edit({ embeds: [rrEmbed] });
} else {
msg = await ch.send({ embeds: [rrEmbed] });
}

saved[panel.title] = msg.id;

for (const emoji of Object.keys(panel.roles)) {
await msg.react(emoji).catch(() => {});
}
} catch (err) {
console.log("Panel error:", err.message);
}
}

saveMessages(saved);

console.log("Bot loaded successfully");
});

// ================= DROPDOWN INTERACTION =================
client.on("interactionCreate", async interaction => {
if (!interaction.isStringSelectMenu()) return;
if (interaction.customId !== "roles_menu") return;

try {
await interaction.deferReply({ ephemeral: true });

const member = await interaction.guild.members.fetch(interaction.user.id);

for (const role of roles) {
await member.roles.remove(role.roleId).catch(() => {});
}

for (const roleId of interaction.values) {
await member.roles.add(roleId).catch(() => {});
}

await interaction.editReply("✅ Roles updated!");
} catch (err) {
console.error(err);

if (!interaction.replied) {
await interaction.reply({
content: "❌ Failed to update roles",
ephemeral: true
}).catch(() => {});
}
}
});

// ================= REACTION ROLES =================
client.on("messageReactionAdd", async (reaction, user) => {
if (user.bot) return;
if (reaction.partial) await reaction.fetch();

const guild = reaction.message.guild;
if (!guild) return;

for (const panel of reactionRolesPanels) {
const role = panel.roles[reaction.emoji.name];
if (!role) continue;

const member = await guild.members.fetch(user.id);
await member.roles.add(role.roleId).catch(() => {});
}
});

client.on("messageReactionRemove", async (reaction, user) => {
if (user.bot) return;
if (reaction.partial) await reaction.fetch();

const guild = reaction.message.guild;
if (!guild) return;

for (const panel of reactionRolesPanels) {
const role = panel.roles[reaction.emoji.name];
if (!role) continue;

const member = await guild.members.fetch(user.id);
await member.roles.remove(role.roleId).catch(() => {});
}
});

// ================= LOGIN =================
client.login(process.env.TOKEN);
