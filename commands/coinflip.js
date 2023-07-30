const { SlashCommandBuilder,  ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { coinFlip } = require("../utils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin and pick maps for ENSL tournaments."),
  async execute(client, interaction, flipList) {
    let players = [];
    // Get the player's ID from the interaction
    const playerId = interaction.user.id;
    let counter = 0;

    // Check if it's the first player initiating the interaction
    if (flipList.length === 0) {
      // Store the first player's ID
      flipList.push(playerId);

      // Reply to the interaction acknowledging the player's participation
      await interaction.reply(
        "You initiated the coinflip. You are heads! Waiting for another player to join."
      );
    } else if (flipList.length === 1) {
      // Check if it's the second player joining the interaction
      if (flipList[0] !== playerId) {
        // Store the second player's ID
        flipList.push(playerId);

        // Perform the coinflip
        const result = coinFlip();

        // Determine the winner and loser based on the coinflip result
        const winnerId = result === "heads" ? flipList[0] : flipList[1];
        const loserId = result === "heads" ? flipList[1] : flipList[0];

        // Proceed with the map picking logic using the winnerId and loserId variables
        
      let results = []
      const targetUserId = winnerId

    // Check if the interaction user is the target user

    const numMatchesRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("3")
        .setLabel("3")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("5")
        .setLabel("5")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("7")
        .setLabel("7")
        .setStyle(ButtonStyle.Primary),
    );

    const pick = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId("Map")
      .setLabel("Map")
      .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
      .setCustomId("Side")
      .setLabel("Side")
      .setStyle(ButtonStyle.Primary)
    )

    await interaction.reply({
      content: 
          `The coin landed on ${result}. ${client.users.cache.get(
            winnerId
          )} wins!\nHow many rounds are in this series?`,
      components: [numMatchesRow]
    });

    const filter = i => i.user.id === targetUserId;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

 

    collector.on("collect", async i => {
      switch (counter) {
        case 0:
          switch (i.customId) {
            case "3":
              results[0] = 3;
            case "5":
              results[0] = 3;
            case "7":
              results[0] = 3;
          }
          await interaction.update({
            content:
              `The coin landed on ${result}. ${client.users.cache.get(
                winnerId
              )} wins!\nThis is a best of ${results[0]}.\n${client.users.cache.get(winnerId)}, Would you like to pick Map or Side?`,
              
            components: [pick]
          })
          counter = 1
        
        case 1:
          switch (id.customId) {
            case "Map":
              results[1] = "Map";
            case "Side": 
              results[1] = "Side";
          }
        };
    })
    collector = interaction.channel.createMessageComponentCollector({time: 30000 });

    collector.on("collect", async i => {
      await i.update({
        content: `${client.users.cache.get(winnerId)} picked: ${i.customId}\nHow many rounds are in this series?`,
        components: [row] // Remove the buttons
      });      
    });

    collector.on("end", async collected => {
      if (collected.size === 0) {
        await interaction.followUp("No response received. Time limit exceeded.");
        flipList = [];
      }
    });

        flipList = [];
        // ...
      } else {
        // Reply to the interaction indicating that the same player cannot join twice
        await interaction.reply("You cannot join the coinflip more than once.");
        flipList = [];
      }
    } else {
      // Reply to the interaction indicating that the maximum number of players is reached
      await interaction.reply("The coinflip already has two players.");
      flipList = [];
    }
  },
};
