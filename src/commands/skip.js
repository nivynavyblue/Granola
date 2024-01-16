const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pula a música atual"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      await interaction.reply(
        "A granola não encontrou nada, mas que surpresa."
      );
      return;
    }
    const currentSong = queue.currentTrack;
    queue.node.skip();
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `A granola não gostou da música ${currentSong.title} e decidiu mandar ela para as cucuias!`
          )
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
