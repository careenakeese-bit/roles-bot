// ================= EXPRESS (KEEP FLY ALIVE) =================
const express = require("express");
const app = express();

app.get("/", (req, res) => {
res.status(200).send("Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
console.log("Web server running on port", PORT);
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
try {
if (!fs.existsSync(MESSAGE_FILE)) return {};
return JSON.parse(fs.readFileSync(MESSAGE_FILE));
} catch (err) {
console.error("Error loading messages.json:", err);
return {};
}
}

function saveMessages(data) {
try {
fs.writeFileSync(MESSAGE_FILE, JSON.stringify(data, null, 2));
} catch (err) {
console.error("Error saving messages.json:", err);
}
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
console.log("READY EVENT FIRED");
console.log(`${client.user.tag} is online!`);

const channel = client.channels.cache.get(channelId);
if (!channel) {
console.log("ERROR: channelId not found or bot has no access");
return;
}

let saved = loadMessages();

// ---------------- DROPDOWN ----------------
const embed = new MessageEmbed()
.setTitle("🎮 Game Roles")
.setDescription("Select your games below")
.setColor("#ff0080");

const menu = new MessageSelectMenu()
.setCustomId("roles_menu")
.setPlaceholder("Select games")
.setMaxValues(Math.min(roles.length, 25)) // safety limit
.addOptions(
roles.map(r => ({
label: r.label,
value: r.roleId,
emoji: r.emoji
}))
);

const row = new MessageActionRow().addComponents(menu);

await channel.send({ embeds: [embed], components: [row] });

// ---------------- REACTION ROLES ----------------
for (const panel of reactionRolesPanels) {
const ch = client.channels.cache.get(panel.channelId);
if (!ch) continue;

let description = "";

for (const [emoji, data] of Object.entries(panel.roles)) {
description += `${emoji} ${data.label}\n`;
}

const rrEmbed = new MessageEmbed()
.setTitle(panel.title)
.setDescription(description)
.setColor(panel.color || "#00ffcc");

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
await msg.react(emoji).catch(console.error);
}
}

saveMessages(saved);

console.log("Panels loaded without duplicates.");
});

// ================= REACTION ROLES =================
client.on("messageReactionAdd", async (reaction, user) => {
if (user.bot) return;

try {
if (reaction.partial) await reaction.fetch();

const guild = reaction.message.guild;
if (!guild) return;

for (const panel of reactionRolesPanels) {
const data = panel.roles[reaction.emoji.name];
if (!data) continue;

const member = await guild.members.fetch(user.id);
await member.roles.add(data.roleId).catch(console.error);
}
} catch (err) {
console.error("Reaction add error:", err);
}
});

client.on("messageReactionRemove", async (reaction, user) => {
if (user.bot) return;

try {
if (reaction.partial) await reaction.fetch();

const guild = reaction.message.guild;
if (!guild) return;

for (const panel of reactionRolesPanels) {
const data = panel.roles[reaction.emoji.name];
if (!data) continue;

const member = await guild.members.fetch(user.id);
await member.roles.remove(data.roleId).catch(console.error);
}
} catch (err) {
console.error("Reaction remove error:", err);
}
});

// ================= DEBUG =================
client.on("debug", console.log);
client.on("error", console.error);

// ================= LOGIN =================
try {
client.login(process.env.TOKEN);
} catch (err) {
console.error("LOGIN FAILED:", err);
}
