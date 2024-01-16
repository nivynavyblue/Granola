const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Exibe as 10 primeiras músicas da fila"),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray();
    if (!queue || tracks.length === 0) {
      await interaction.reply(
        "A granola não conseguiu dizer quais músicas estão na fila, não fique bravo com ela."
      );
      return;
    }
    const queueString = queue.tracks
      .toArray()
      .slice(0, 10)
      .map((song, i) => {
        return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`;
      })
      .join("\n");
    const currentSong = queue.currentTrack;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `**Tocando no momento**\n` +
              (currentSong
                ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>`
                : "Nenhuma") +
              `\n\n**Granola Fila**\n${queueString}`
          )
          .setThumbnail(currentSong.setThumbnail),
      ],
    });
  },
};
