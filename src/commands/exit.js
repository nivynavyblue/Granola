const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("exit")
    .setDescription(
      "Espanta a granola da sala e manda ela ir brincar com outra coisa..."
    ),
  execute: async ({ client, interaction }) => {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      await interaction.reply("Não existe nenhuma música na fila");
      return;
    }
    queue.destroy();
    await interaction.reply("Granola is no more.");
  },
};
