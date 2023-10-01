const { SlashCommandBuilder } = require('discord.js');
const { startGather } = require('../utils.js')

module.exports = {
  data: new SlashCommandBuilder() 
    .setName('join')
    .setDescription('Join the gather.'),
  async execute(client, interaction, players) {
    // Get the player's ID from the interaction
    const playerId = interaction.user.id;

    // Check if the player is already in the list
    if (players.includes(playerId)) {
      interaction.reply({content: 'You are already in the gather.', ephemeral: true});
      return;
    }

    //If gather is full and starting
    if (players.length >= 12) {
      interaction.reply({content: 'Gather is currently starting, please wait.', ephemeral: true});
    }

    // Add the player to the list
    players.push(playerId);

    interaction.reply({content: 'You have joined the gather.', ephemeral: true});

    //Check if gather is now full
    if (players.length == 2) {
      startGather(client, players);
    }    
  }
}