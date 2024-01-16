const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { useMasterPlayer } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Manda a granola tocar uma musica do youtube")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Manda ela pesquisar por um vídeo no youtube")
        .addStringOption((option) =>
          option
            .setName("searchterms")
            .setDescription(
              "palavra chave (seje bem especifico ela não é muito esperta)"
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Manda a granola reproduzir uma playlist do youtube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("link da playlist pra ela perder")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Pede pra granola reproduzir uma música do youtube")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("url da musica")
            .setRequired(true)
        )
    ),
  execute: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel)
      return interaction.reply(
        "Você precisa estar em um canal de voz se não a granola não vai vir pra você, ela é timida. (não adianta fazer pspspsps)."
      );

    const player = useMasterPlayer();
    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");

      const result = await player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });

      if (result.tracks.length === 0) {
        return interaction.reply(
          "A granola não encontrou nada, mas que surpresa."
        );
      }

      const song = result.tracks[0];
      player.play(interaction.member.voice.channel, song);

      embed
        .setDescription(
          `**[${song.title}](${song.url})** foi farejado adicionado a fila.`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duração: ${song.duration}` });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });

      if (result.tracks.length === 0)
        return interaction.reply(
          `A granola não encontrou nada, mas que surpresa.`
        );

      const playlist = result.playlist;
      player.play(interaction.member.voice.channel, playlist);

      embed
        .setDescription(
          `**${result.tracks.length} músicas da playlist: [${playlist.title}](${playlist.url})** foram farejadas e adicionadas a fila`
        )
        .setThumbnail(playlist.thumbnail);
    } else if (interaction.options.getSubcommand() === "search") {
      let url = interaction.options.getString("searchterms");

      const result = await player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO,
      });

      if (result.tracks.length === 0)
        return interaction.editReply(
          "A granola não encontrou nada, mas que surpresa."
        );

      const song = result.tracks[0];
      player.play(interaction.member.voice.channel, result);

      embed
        .setDescription(
          `**[${song.title}](${song.url})** foi adicionado a fila`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duração: ${song.duration}` });
    }

    await interaction.reply({
      embeds: [embed],
    });
  },
};
