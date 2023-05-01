module.exports = {
  name: 'join',
  description: 'Join the gather.',
  execute(message, players) {
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