const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the gather.'),
  async execute(interaction, players) {
    // Get the player's ID from the interaction
    const playerId = interaction.user.id;

    // Check if the player is in the list
    if (!players.includes(playerId)) {
      interaction.reply('You are not in the gather.');
      return;
    }

    const index = players.indexOf(playerId);
    if (index !== -1) {
      players.splice(index, 1);
    }

    interaction.reply('You have left the gather.');
  }
}