const { SlashCommandBuilder } = require('discord.js');
const { endGather } = require("../utils.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the gather.'),
  async execute(client, interaction, players) {
    // Get the player's ID from the interaction
    const playerId = interaction.user.id;

    // Check if the player is in the list
    if (!players.includes(playerId)) {
      interaction.reply('You are not in the gather.');
      return;
    }

    if (players.length == 12) {
      endGather();
    }

    const index = players.indexOf(playerId);
    if (index !== -1) {
      players.splice(index, 1);
    }

    interaction.reply('You have left the gather.');
  }
}