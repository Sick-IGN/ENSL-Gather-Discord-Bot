const { dbpassword } = require("./private.json");
const { dbhost, dbport, dbuser, dbdatabase, channelId } = require("./config.json");
const { StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ComponentType } = require("discord.js");
const mysql = require("mysql");

//Gather vote logic
async function startGather(client, players) {
  //get channel
  const channel = await client.channels.fetch(channelId);

  //notification of gather start
  const notification = "Gather is starting!";
  channel.send(notification);

  //Marine Captain, Alien Captain, Map, Server
  let results = [-1, -1, -1, -1];
  await votes(client, channel , players, results);
}

async function votes(client, channel, players, results) {
  const playerNames = players.map((id) => {
    const player = channel.guild.members.cache.get(id);
    return `${player.user.username}`;
  });

  (async () => {
    try {
      //Selection for each player
      const playerRows = playerNames.map((playerName) =>
        new StringSelectMenuOptionBuilder()
        .setLabel(playerName)
        .setValue(playerName)
      );

      //Selection for each map
      const mapQuery = "SELECT * FROM `maps`";
      const mapDBReturn = await queryDatabase(mapQuery);
      const mapRows = mapDBReturn.map((row) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(row.publicName)
          .setValue(row.publicName)
      );

      //Selection for each server
      const serverQuery = "SELECT * FROM `servers`";
      const serverDBReturn = await queryDatabase(serverQuery);
      const serverRows = serverDBReturn.map((row) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(row.name)
          .setValue(row.name)
      );

      const playerMenu = new ActionRowBuilder()
        .addComponents(new StringSelectMenuBuilder()
          .setCustomId('players')
          .setPlaceholder('Pick your captains! 2 votes.')
          .addOptions(...playerRows)
          .setMinValues(1)
          .setMaxValues(2)
        );

      const mapMenu = new ActionRowBuilder()
        .addComponents(new StringSelectMenuBuilder()
          .setCustomId('maps')
          .setPlaceholder('Pick your map! 2 votes.')
          .addOptions(...mapRows)
          .setMinValues(1)
          .setMaxValues(2)
        );

      const serverMenu = new ActionRowBuilder()
        .addComponents(new StringSelectMenuBuilder()
          .setCustomId('servers')
          .setPlaceholder('Pick your server! 2 votes.')
          .addOptions(...serverRows)
          .setMinValues(1)
          .setMaxValues(2)
        );

      //Send message with player votes
      const playerMessage = await channel.send({
        content: "Please vote for team captains! 2 votes!",
        components: [playerMenu],
      });
      const mapMessage = await channel.send({
        content: "Please vote for maps! 2 votes!",
        components: [mapMenu],
      });
      const serverMessage = await channel.send({
        content: "Please vote for servers! 2 votes!",
        components: [serverMenu],
      });

      const playerCollector = playerMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 30000,
      });
      const mapCollector = mapMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 30000,
      });
      const serverCollector = serverMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 30000,
      });

      playerCollector.on("collect", (interaction) => {
        interaction.reply({content: "Votes received.", ephemeral: true})
      });

      mapCollector.on("collect", (interaction) => {
        interaction.reply({content: "Votes received.", ephemeral: true})        
      });

      serverCollector.on("collect", (interaction) => {
        interaction.reply({content: "Votes received.", ephemeral: true})        
      });
      

      playerCollector.on("end", (collected) => {
        const [interactionId, interaction] = collected.entries().next().value;

        const selectedValues = [...interaction.values()];

        // Do whatever you need with the selected values (e.g., logging them)
        console.log(`Interaction ID: ${interactionId}`);
        console.log(`Selected Values: ${selectedValues.join(', ')}`); // If selectedValues is an array of strings

      });
      mapCollector.on("end", (collected) => {
        //console.log(collected[0].values);
      });
      serverCollector.on("end", (collected) => {
        //console.log(collected[0].values);
      });
    } catch (error) {
      console.error("Something broked :) ", error);
    }
  })();

  return new Promise(async (resolve) => {
    setTimeout(() => {
      resolve();
    }, 63000);
  });
}

function endGather() {}

//Split array of buttons, returns array of actionbars or requested length
function splitRow(inbuttons, length) {
  let bars = [];
  for (i = 0; i < inbuttons.length; i += length) {
    let buttons = [];
    for (j = 0; j < length; j++) {
      if (j + i > inbuttons.length - 1) break;
      buttons.push(inbuttons[j + i]);
    }
    bars.push(new ActionRowBuilder().addComponents(...buttons));
  }
  return bars;
}

const queryDatabase = (query) => {
  const connection = mysql.createConnection({
    host: dbhost,
    port: dbport,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase,
  });
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to DB"', err);
      return;
    }
    console.log("Connected to DB");
  });

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

function coinFlip() {
  return Math.random() < 0.5 ? "heads" : "tails";
}

module.exports = { startGather, endGather, coinFlip };