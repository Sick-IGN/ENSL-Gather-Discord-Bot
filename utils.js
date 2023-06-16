const { dbpassword } = require('./private.json');
const { dbhost, dbuser, dbdatabase, channelId } = require('./config.json');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const mysql = require('mysql');

//Gather vote logic
async function startGather(client, players) {

  //get channel
  const channel = await client.channels.fetch(channelId);

  //notification of gather start
  const notification = 'Gather is starting!';
  channel.send(notification);
  
  //Marine Captain, Alien Captain, Map, Server
  let results = [-1, -1, -1, -1];
  await votes(client, channel, players, results);

}

async function votes(client, channel, players, results) {

  const playerNames = players.map(id => {
    const player = channel.guild.members.cache.get(id);
    return `${player.user.username}`;
  });
  const maxSelections = 2;

  
  (async () => {
    try {

      //Button for each player
      const playerButtons = playerNames.map((playerName) =>
        new ButtonBuilder()
          .setLabel(playerName)
          .setCustomId(playerName)
          .setStyle(ButtonStyle.Primary)
      );

      //Button for each map
      const mapQuery = 'SELECT * FROM `maps`';
      const mapDBReturn = await queryDatabase(mapQuery);
      const mapButtons = mapDBReturn.map((row) =>
        new ButtonBuilder()
          .setLabel(row.publicName)
          .setCustomId(row.publicName)
          .setStyle(ButtonStyle.Primary)
      );

      //Button for each server
      const serverQuery = 'SELECT * FROM `servers`';
      const serverDBReturn = await queryDatabase(serverQuery);
      const serverButtons = serverDBReturn.map((row) =>
        new ButtonBuilder()
          .setLabel(row.name)
          .setCustomId(row.name)
          .setStyle(ButtonStyle.Primary)
      );

    //ActionRows for the buttons
    const playerRows = splitRow(playerButtons, 4);
    const mapRows = splitRow(mapButtons, 4);
    const serverRows = splitRow(serverButtons, 4);

      //Send message with player votes
    const playerMessage = await channel.send({
      content: 'Please vote for team captains! 2 votes!',
      components: [...playerRows]
    });
    const mapMessage = await channel.send({
      content: 'Please vote for maps! 2 votes!',
      components: [...mapRows]
    });
    const serverMessage = await channel.send({
      content: 'Please vote for servers! 2 votes!',
      components: [...serverRows]
    });
    
    const playerCollector = playerMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });
    const mapCollector = mapMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });
    const serverCollector = serverMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000
    });

    let voteCount = new Map();
    players.forEach((currentValue) => {
      //[playervotes, mapvotes, servervotes]
      voteCount.set(currentValue, [0,0,0]);
    });

    await playerCollector.on('collect', (interaction) => {
      const userId = interaction.user.id;
      const userVotes = voteCount.get(userId)[0];

      if (userVotes >= maxSelections) {
        interaction.reply({
          content: 'You have already selected the maximum number of votes. Please remove votes before voting more.',
          ephemeral: true
        });
        return;
      }

      voteCount.set(userId, [userVotes + 1, voteCount.get(userId)[1], voteCount.get(userId)[2]]);
      const button = interaction.component;
      button.setStyle(ButtonStyle.Success);
      button.setDisabled(true);      
      interaction.reply({
        content: 'Success!',
        ephemeral: true
      });

    });

    mapCollector.on('collect', (interaction) => {
      const userId = interaction.user.id;
      const userVotes = voteCount.get(userId)[1];

      if (userVotes >= maxSelections) {
        interaction.reply({
          content: 'You have already selected the maximum number of votes. Please remove votes before voting more.',
          ephemeral: true
        });
        return;
      }

      voteCount.set(userId, [voteCount.get(userId)[0], userVotes + 1, voteCount.get(userId)[2]]);
      const button = interaction.component;
      button.setStyle(ButtonStyle.Success);
      button.setDisabled(true);      
      interaction.reply({
        content: 'Success!',
        ephemeral: true
      });

    });

    serverCollector.on('collect', (interaction) => {
      const userId = interaction.user.id;
      const userVotes = voteCount.get(userId)[2];

      if (userVotes >= maxSelections) {
        interaction.reply({
          content: 'You have already selected the maximum number of votes. Please remove votes before voting more.',
          ephemeral: true
        });
        return;
      }

      voteCount.set(userId, [voteCount.get(userId)[0], voteCount.get(userId)[1], userVotes + 1]);

      const button = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel(interaction.customId)
        .setCustomId(interaction.customId)
        .toJSON();

      //interaction.reply({
      //  content: `You have selected ${interaction.customId}.`,
      //  ephemeral: true
      //});
      
      interaction.component.style = ButtonStyle.Success;
      let allComponents = interaction.message.components;
      interaction.update({components: allComponents});
      interaction.reply({
        content: `You have selected ${interaction.customId}.`,
        ephemeral: true
      });

    });

    playerCollector.on('end', (collected) => {
      console.log('boob');
    });
    mapCollector.on('end', (collected) => {
      console.log('boobs');
    });
    serverCollector.on('end', (collected) => {
      console.log('boobies');
    });
  
    } catch (error) {
      console.error('Something broked :) ', error);
    }
  })();



  return new Promise(async (resolve) => {
    
  
    setTimeout(() => {
      
      resolve();
    }, 63000);
  });
}

function endGather() {};

module.exports = { startGather, endGather };

//Split array of buttons, returns array of actionbars or requested length
function splitRow(inbuttons, length) {
  let bars = [];
  for (i = 0; i < inbuttons.length; i+=length) {
    let buttons = [];
    for (j = 0; j < length; j++) {
      if (j+i > inbuttons.length-1) break;
      buttons.push(inbuttons[j+i]);
    }
    bars.push(new ActionRowBuilder().addComponents(...buttons));
  }
  return bars;
}

const queryDatabase = (query) => {

  const connection = mysql.createConnection({
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase
  });
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to DB"', err);
      return;
    }
    console.log('Connected to DB');
  })

  return new Promise((resolve, reject) => {
    connection.query(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};