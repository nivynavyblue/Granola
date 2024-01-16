const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Manda a granola pausar a música atual"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      await interaction.reply("Não existem músicas na fila.");
      return;
    }
    queue.node.setPaused(true);
    await interaction.reply("Música pausada.");
  },
};
