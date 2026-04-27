// ================= EXPRESS (KEEP FLY ALIVE) =================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
console.log("Web server running on port 3000");
});

// ================= DISCORD BOT =================
const fs = require("fs");
const {
Client,
GatewayIntentBits,
Partials,
ActionRowBuilder,
StringSelectMenuBuilder,
EmbedBuilder
} = require("discord.js");

const { roles, reactionRolesPanels, channelId } = require("./config.js");

const MESSAGE_FILE = "./messages.json";

function loadMessages() {
if (!fs.existsSync(MESSAGE_FILE)) return {};
return JSON.parse(fs.readFileSync(MESSAGE_FILE));
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
console.log("READY EVENT FIRED");
console.log(`${client.user.tag} is online!`);

const channel = await client.channels.fetch(channelId).catch(() => null);
if (!channel) return console.log("Channel not found");

let saved = loadMessages();

// ---------------- DROPDOWN ----------------
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

await channel.send({
embeds: [embed],
components: [row]
});

// ---------------- REACTION ROLES ----------------
for (const panel of reactionRolesPanels) {
const ch = await client.channels.fetch(panel.channelId).catch(() => null);
if (!ch) continue;

let description = "";

for (const [emoji, data] of Object.entries(panel.roles)) {
description += `${emoji} ${data.label}\n`;
}

const rrEmbed = new EmbedBuilder()
.setTitle(panel.title)
.setDescription(description)
.setColor(panel.color);

let msg;

if (saved[panel.title]) {
try {
msg = await ch.messages.fetch(saved[panel.title]);
await msg.edit({ embeds: [rrEmbed] });
} catch {
msg = await ch.send({ embeds: [rrEmbed] });
}
} else {
msg = await ch.send({ embeds: [rrEmbed] });
}

saved[panel.title] = msg.id;

for (const emoji of Object.keys(panel.roles)) {
await msg.react(emoji).catch(() => {});
}
}

saveMessages(saved);

console.log("Panels loaded without duplicates.");
});

// ================= INTERACTION FIX =================
client.on("interactionCreate", async (interaction) => {
if (!interaction.isStringSelectMenu()) return;
if (interaction.customId !== "roles_menu") return;

try {
const member = interaction.member; // ✅ SAFE (no fetch)

// remove all dropdown roles
for (const role of roles) {
await member.roles.remove(role.roleId).catch(() => {});
}

// add selected roles
for (const roleId of interaction.values) {
await member.roles.add(roleId).catch(() => {});
}

await interaction.reply({
content: "✅ Roles updated!",
ephemeral: true
});

} catch (err) {
console.error("Interaction error:", err);

if (!interaction.replied) {
await interaction.reply({
content: "❌ Failed to update roles.",
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
const data = panel.roles[reaction.emoji.name];
if (!data) continue;

const member = await guild.members.fetch(user.id);
await member.roles.add(data.roleId).catch(() => {});
}
});

client.on("messageReactionRemove", async (reaction, user) => {
if (user.bot) return;
if (reaction.partial) await reaction.fetch();

const guild = reaction.message.guild;
if (!guild) return;

for (const panel of reactionRolesPanels) {
const data = panel.roles[reaction.emoji.name];
if (!data) continue;

const member = await guild.members.fetch(user.id);
await member.roles.remove(data.roleId).catch(() => {});
}
});

// ================= LOGIN =================
client.on("debug", console.log);
client.on("error", console.error);

client.login(process.env.TOKEN);
