const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setname('leave')
    .setdescription('Leave the gather.'),
  async execute(message, players) {
    // Get the player's ID from the message
    const playerId = message.author.id;

    // Check if the player is in the list
    if (!players.includes(playerId)) {
      message.reply('You are not in the gather.');
      return;
    }

    // Remove the player from the list
    players = players.filter(id => id !== playerId);

    message.reply('You have left the gather.');
  }
}