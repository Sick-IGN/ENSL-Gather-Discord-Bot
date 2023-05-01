module.exports = {
  name: 'list',
  description: 'List the players in the gather.',
  execute(message, players) {
    // Get the list of players
    const playerNames = players.map(id => `<@${id}>`);

    // Create a message with the list of players
    const response = playerNames.length > 0
      ? `Players in the gather: ${playerNames.join(', ')}`
      : 'No players in the gather.';

    message.reply(response);
  }
}