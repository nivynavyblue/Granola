const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Despausa a música atual"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      await interaction.reply(
        "A granola não encontrou nada, mas que surpresa."
      );
      return;
    }
    queue.node.setPaused(false);
    await interaction.reply("Música despausada.");
  },
};
