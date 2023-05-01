const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List the players in the gather.'),
  async execute(interaction, players) {
    
    // Get the list of players
    const playerNames = players.map(id => {
      const player = interaction.guild.members.cache.get(id);
      return `${player.user.username}#${player.user.discriminator}`;
    });

    // Create a interaction with the list of players
    const response = playerNames.length > 0
      ? `Players in the gather: ${playerNames.join(', ')}`
      : 'No players in the gather.';

    interaction.reply(response);
  }
}


