require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require("discord.js");
const { Player } = require("discord-player");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
  intents: ["Guilds", "GuildMessages", "GuildVoiceStates"],
});

//Carrega os comandos da pasta "commands"
const commands = [];
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  commands.push(command);
}

//Cria o player e ajusta a qualidade de audio.

const player = Player.singleton(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

player.client.on("ready", () => {
  const guild_ids = client.guilds.cache.map((guild) => guild.id);
  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  //Registra os comandos para todos os usuários
  for (const guildId of guild_ids) {
    rest
      .put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
        body: commands.map((c) => c.data),
      })
      .then(() => console.log(`Adicionado comandos ao id ${guildId}`))
      .catch(console.error);
  }
});

//Command interaction handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute({ client, interaction });
  } catch (err) {
    console.log(err);
    await interaction.reply("A granola não soube o que fazer e foi embora em pânico, tente novamente mais tarde.");
  }
});

client.login(process.env.TOKEN);
