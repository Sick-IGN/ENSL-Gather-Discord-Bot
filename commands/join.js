const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder() 
    .setname('join')
    .setdescription('Join the gather.'),
  async execute(message, players) {
    // Get the player's ID from the message
    const playerId = message.author.id;

    // Check if the player is already in the list
    if (players.includes(playerId)) {
      message.reply('You are already in the gather.');
      return;
    }

    // Add the player to the list
    players.push(playerId);

    message.reply('You have joined the gather.');
  }
}