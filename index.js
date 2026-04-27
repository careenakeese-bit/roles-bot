// ================= EXPRESS (KEEP FLY ALIVE) =================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
console.log("Web server running");
});

// ================= DISCORD BOT =================
const fs = require("fs");
const {
Client,
Intents,
MessageActionRow,
MessageSelectMenu,
MessageEmbed
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
Intents.FLAGS.GUILDS,
Intents.FLAGS.GUILD_MEMBERS,
Intents.FLAGS.GUILD_MESSAGES,
Intents.FLAGS.GUILD_MESSAGE_REACTIONS
],
partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

// ================= READY =================
client.once("ready", async () => {
console.log(`${client.user.tag} is online!`);

const channel = client.channels.cache.get(channelId);
if (!channel) return console.log("Channel not found");

const embed = new MessageEmbed()
.setTitle("🎮 Game Roles")
.setDescription("Select your games below")
.setColor("#ff0080");

const menu = new MessageSelectMenu()
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

const row = new MessageActionRow().addComponents(menu);

await channel.send({ embeds: [embed], components: [row] });

console.log("Dropdown sent.");
});

// ================= DROPDOWN FIX (THIS IS WHAT YOU WERE MISSING) =================
client.on("interactionCreate", async (interaction) => {
if (!interaction.isSelectMenu()) return;
if (interaction.customId !== "roles_menu") return;

const member = interaction.member;

try {
// remove all roles first (optional behavior)
for (const r of roles) {
await member.roles.remove(r.roleId).catch(() => {});
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
console.error(err);
await interaction.reply({
content: "❌ Error applying roles",
ephemeral: true
});
}
});

// ================= REACTION ROLES (KEEP YOUR EXISTING SYSTEM) =================
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
client.login(process.env.TOKEN);
