module.exports = {
  name: 'voiceStateUpdate',
  async execute(client, oldState, newState) {

      // ATTENTE BDA MESSAGE

      const guild = newState.guild;
      const user = newState.member.user;
      const textChannel = client.channels.cache.get(client.config.get("settings.channels.bda_text"));
      const voiceChannel = client.guild.channels.cache.get(client.config.get("settings.channels.bda_voice"));
    
      if (newState && newState.channelId === voiceChannel.id) {
        client.usersData[newState.member.id] = Date.now();

        const message = await textChannel.messages.fetch(client.config.get("data.bda_message_id")).catch(() => null);

        const users = client.getClassmentUsers(voiceChannel);
    
        const embed = client.buildEmbed(users.length > 0 ? users.join('\n') : 'Aucune personne présente dans le salon Attente BDA', true)
            .setTitle('Temps d\'attente en bda');
  
        if (message) {
          message.edit({ embeds: [embed] });
        } else {
          message = await textChannel.send({ embeds: [embed] });
          client.config.set("data.bda_message_id", message.id);
          client.config.save();
        }

        setTimeout(() => {      
          if (voiceChannel.members.has(user.id)) {
            const embed = client.buildEmbed(`Le membre ${user} (${user.tag}) est en attente BDA depuis 25 minutes.`, true)
              .setTitle('<:megaphone:1127558169774792744> | Attention attente BDA');
    
            client.channels.cache.get(client.config.get("settings.channels.waiting_too_long_bda")).send({ embeds: [embed] });
    
            console.log(`Le joueur ${user.tag} attend depuis 25 minutes en attente BDA un message a été envoyer dans le salon.`);
          }
        }, 25 * 60 * 1000);
      }
      else {
        delete client.usersData[oldState.member.id];
      }
  },
};