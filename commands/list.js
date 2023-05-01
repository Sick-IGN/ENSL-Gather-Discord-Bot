const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setname('list')
    .setdescription('List the players in the gather.'),
  async execute(message, players) {
    // Get the list of players
    const playerNames = players.map(id => `<@${id}>`);

    // Create a message with the list of players
    const response = playerNames.length > 0
      ? `Players in the gather: ${playerNames.join(', ')}`
      : 'No players in the gather.';

    message.reply(response);
  }
}