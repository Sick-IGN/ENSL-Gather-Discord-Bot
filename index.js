// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Define a global variable to store the list of players
let players = [];

// Import the command modules
const joinCommand = require('./join.js');
const leaveCommand = require('./leave.js');
const listCommand = require('./list.js');

// Map each command to its name
const commands = new Map([
  [joinCommand.name, joinCommand],
  [leaveCommand.name, leaveCommand],
  [listCommand.name, listCommand],
]);

client.on('message', message => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Parse the command name and arguments from the message content
  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Get the command object from the commands map
  const command = commands.get(commandName);

  // If the command doesn't exist, exit early
  if (!command) return;

  // Execute the command
  command.execute(message, players);
});


// Log in to Discord with your client's token
client.login(token);