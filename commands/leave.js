module.exports = {
  name: 'leave',
  description: 'Leave the gather.',
  execute(message, players) {
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