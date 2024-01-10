const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(commandsPath + `/${file}`);
    commands.push(command.data.toJSON());
}

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

      const rest = new REST({ version: '10' }).setToken(client.config.get("token"));

      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
      } catch (error) {
        console.error(error);
      }

      console.log(`Connecté en tant que ${client.user.tag}`);

      client.user.setPresence({
        activity: { name: 'Light City | !help', type: 'PLAYING' },
        status: 'online'
      });

       const messageChannelId = client.config.get("settings.channels.auto_message");
       setInterval(() => {
         if (client.messageCount >= 1) {
          const channel = client.channels.cache.get(messageChannelId);
           if (channel) {
             const embed1 = client.buildEmbed(null, false)
               .setTitle('__**Soutenir le serveur et GRATUITEMENT !**__')
               .addFields(
                 { name: 'Bonjour à tous,', value: 'J\'espère que vous allez bien.'}               );
      
             const embed2 = client.buildEmbed(null, false)
               .setTitle('__**Soutenir le serveur !**__')
               .addFields(
                 { name: 'Bonjour à tous,', value: '**Dans le but de soutenir le serveur**, nous vous rappelons qu\'une boutique est disponible à l\'adresse suivante :' }              );
      
             channel.send({ embeds: [embed1] });
             channel.send({ embeds: [embed2] });
           }
           client.messageCount = 0;
         }
       }, 2 * 60 * 60 * 1000);

      const bdaChannel = client.channels.cache.get(client.config.get("settings.channels.bda_text"));
      const bdaVoiceChannel = client.channels.cache.get(client.config.get("settings.channels.bda_voice"));

      let bdaMessage = await bdaChannel.messages.fetch(client.config.get("data.bda_message_id")).catch(() => null);
      const embed = client.buildEmbed('Aucune personne présente dans le salon Attente BDA', true)
      .setTitle('Temps d\'attente en bda');

      if (!bdaMessage) {
        bdaMessage = await bdaChannel.send({embeds: [embed] });
        client.config.set("data.bda_message_id", bdaMessage.id);
        client.config.save();
      }
      setInterval(() => {
        const users = client.getClassmentUsers(bdaVoiceChannel);
        embed.setDescription(users.length > 0 ? users.join('\n') : 'Aucune personne présente dans le salon Attente BDA');
        bdaMessage.edit({ embeds: [embed] });
      }, 1000 * 5);

      const visaChannel = client.channels.cache.get(client.config.get("settings.channels.visa_text"));
      const visaVoiceChannel = client.channels.cache.get(client.config.get("settings.channels.visa_voice"));

      let visaMessage = await visaChannel.messages.fetch(client.config.get("data.visa_message_id")).catch(() => null);
      const visaEmbed = client.buildEmbed('Aucune personne présente dans le salon Attente VISA', true)
      .setTitle('Temps d\'attente en visa');

      if (!visaMessage) {
        visaMessage = await visaChannel.send({embeds: [embed] });
        client.config.set("data.visa_message_id", visaMessage.id);
        client.config.save();
      }
      setInterval(() => {
        const users = client.getClassmentUsers(visaVoiceChannel);
        visaEmbed.setDescription(users.length > 0 ? users.join('\n') : 'Aucune personne présente dans le salon Attente VISA');
        visaMessage.edit({ embeds: [visaEmbed] });
      }, 1000 * 5);
    }

};
