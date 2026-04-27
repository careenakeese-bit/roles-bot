module.exports = {
  token: "",

  channelId: "1346259801780518983",

  // -------------------------
  // DROPDOWN GAME ROLES
  // -------------------------
  roles: [
    { label: "Fortnite", roleId: "1346652677962203166", emoji: "🎮" },
    { label: "Phasmophobia", roleId: "1347371323999125614", emoji: "👻" },
    { label: "Warzone", roleId: "1497610007024242769", emoji: "🔫" },
    { label: "COD", roleId: "1346653370244399254", emoji: "🎯" },
    { label: "The Finals", roleId: "1346653204707803177", emoji: "🔥" },
    { label: "Minecraft", roleId: "1346653254532075551", emoji: "🧱" },
    { label: "Apex Legends", roleId: "1346652870220578931", emoji: "⚡" },
    { label: "GTA", roleId: "1346653564054929479", emoji: "🚗" },
    { label: "Dead by Daylight", roleId: "1346652971815141413", emoji: "🪓" },
    { label: "Roblox", roleId: "1346653302573498530", emoji: "🧸" },
    { label: "Overwatch", roleId: "1347372815120338985", emoji: "🛡️" },
    { label: "Valorant", roleId: "1347372861198827620", emoji: "⚔️" },
    { label: "Sims", roleId: "1347373028287447051", emoji: "🏡" },
    { label: "Rainbow Six Siege", roleId: "1347373110914977792", emoji: "🧨" },
    { label: "Rocket League", roleId: "1347373183606591558", emoji: "⚽" },
    { label: "Rust", roleId: "1347373237826224169", emoji: "🪵" },
    { label: "State of Decay", roleId: "1347373301382643813", emoji: "🧟" },
    { label: "Marvel Rivals", roleId: "1347488583455346778", emoji: "🦸" },
    { label: "Outlast Trials", roleId: "1360537547486531604", emoji: "😱" },
    { label: "Sea of Thieves", roleId: "1347373493242826802", emoji: "🏴‍☠️" },
    { label: "REPO", roleId: "1360536933998264320", emoji: "🤖" },
    { label: "Schedule 1", roleId: "1360537095176847430", emoji: "📅" },
    { label: "Among Us", roleId: "1360537144967561348", emoji: "👀" },
    { label: "Arc Raiders", roleId: "1496309316767055942", emoji: "🚀" }
  ],

  // -------------------------
  // REACTION ROLE PANELS
  // -------------------------
  reactionRolesPanels: [
    {
      channelId: "1346259801780518983",
      title: "📩 DM Status",
      color: "#ff0080",
      roles: {
        "✅": { roleId: "1347044821654573108", label: "DM’s Open" },
        "🤷🏻‍♀️": { roleId: "1347045130116534313", label: "Ask Before DMing" },
        "❌": { roleId: "1347044920124506133", label: "DM’s Closed" }
      }
    },
    {
      channelId: "1346259801780518983",
      title: "🤝 Friend Request Status",
      color: "#ff0080",
      roles: {
        "✅": { roleId: "1475569216785485927", label: "FR’s Open" },
        "🤷🏻‍♀️": { roleId: "1475569277053435954", label: "Ask Before Sending FR" },
        "❌": { roleId: "1475569337526911058", label: "FR’s Closed" }
      }
    },
    {
      channelId: "1346259801780518983",
      title: "🕝 Time Zone",
      color: "#ff0080",
      roles: {
        "❤️": { roleId: "1349514502642729070", label: "Eastern (EST)" },
        "💚": { roleId: "1349514742598860872", label: "Central (CST)" },
        "💛": { roleId: "1349514909859319890", label: "Mountain (MST)" },
        "💙": { roleId: "1349515309253656696", label: "Pacific (PST)" },
        "🧡": { roleId: "1349515414735949896", label: "Other" }
      }
    },
    {
      channelId: "1346259801780518983",
      title: "✨ Interests",
      color: "#ff0080",
      roles: {
        "📹": { roleId: "1352756884301676706", label: "Streamer" },
        "💜": { roleId: "1352756970242703471", label: "Stream Watcher" },
        "📕": { roleId: "1352757071904247918", label: "Reader" },
        "🎶": { roleId: "1352757339782123580", label: "Music Head" },
        "🔮": { roleId: "1352758232485200034", label: "Conspiracies" },
        "🐍": { roleId: "1352760556620222484", label: "Anime" },
        "🍃": { roleId: "1358193906839191724", label: "Stoner" },
        "🍻": { roleId: "1358193993573335140", label: "Drinker" }
      }
    },
    {
      channelId: "1346259801780518983",
      title: "♈ Zodiac Signs",
      color: "#ff0080",
      roles: {
        "♈": { roleId: "1354191430699974818", label: "Aries" },
        "♉": { roleId: "1354191503890579727", label: "Taurus" },
        "♊": { roleId: "1354191548216119426", label: "Gemini" },
        "♋": { roleId: "1354191920791949493", label: "Cancer" },
        "♌": { roleId: "1354191991952376061", label: "Leo" },
        "♍": { roleId: "1354192035506294794", label: "Virgo" },
        "♎": { roleId: "1354192130431651993", label: "Libra" },
        "♏": { roleId: "1354192256663294173", label: "Scorpio" },
        "♐": { roleId: "1354192323877146728", label: "Sagittarius" },
        "♑": { roleId: "1354192442399658056", label: "Capricorn" },
        "♒": { roleId: "1354192557852201091", label: "Aquarius" },
        "♓": { roleId: "1354192599014969515", label: "Pisces" }
      }
    },
    {
      channelId: "1346259801780518983",
      title: "📢 Pings",
      color: "#ff0080",
      roles: {
        "💀": { roleId: "1366170854504927412", label: "Dead Chat" },
        "🦉": { roleId: "1366171002270126170", label: "Night Owl" },
        "🐦": { roleId: "1366196485686820934", label: "Early Bird" },
        "🗣️": { roleId: "1460353342822944799", label: "Voice Chat" },
        "🍿": { roleId: "1494124258446676118", label: "Movie Night" },
        "🫶🏼": { roleId: "1494124424675459215", label: "Chatter" }
      }
    }
  ]
};