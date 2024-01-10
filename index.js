const { Client, Collection, GatewayIntentBits, EmbedBuilder, Partials } = require('discord.js');
const editJsonFile = require("edit-json-file");
const path = require('path');
const fs = require('fs');

const client = new Client({ intents:
  [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Reaction],
});

client.config = editJsonFile(`./config.json`);
client.messageCount = 0;
client.usersData = {};

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.buildEmbed = function buildEmbed(description, hasImage){
    const embed = new EmbedBuilder().setDescription(description).setColor("#FF0000");
    if(hasImage) embed.setImage('https://cdn.discordapp.com/attachments/1090870317196529684/1121542147095662715/standard.gif').setFooter({ text: 'Slapy Bot - En cas de problème, veuillez contacter mrpoulpiii' });
    return embed;
}

client.getClassmentUsers = function getClassmentUsers(voiceChannel) {
  const members = voiceChannel.members.filter(member => !member.user.bot);
  const sortedMembers = members.sort((a, b) => (client.usersData[a.id] || 0) - (client.usersData[b.id] || 0));

  return sortedMembers.map((member, index) => {
    const timeInVoiceChannel = client.usersData[member.id] ? Date.now() - client.usersData[member.id] : 0;
    let timeText = '';

    if (timeInVoiceChannel < 60000) {
      const seconds = Math.floor(timeInVoiceChannel / 1000);
      timeText = `${seconds} seconde${seconds !== 1 ? 's' : ''}`;
    } else {
      const minutes = Math.floor(timeInVoiceChannel / 60000);
      timeText = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    return `${index + 1}. ${member.user.toString()} - ${timeText}`;
  });
}

client.login(client.config.get("token"));
