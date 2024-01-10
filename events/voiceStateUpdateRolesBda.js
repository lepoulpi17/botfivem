module.exports = {
    name: 'voiceStateUpdate',
    async execute(client, oldState, newState) {

        // Ajout du code pour les BDA et les rôles BDA

        const voiceChannelsAndRoles = client.config.get("settings.temp_roles");

        const newUserChannel = newState.channel;
        const oldUserChannel = oldState.channel;
        const logChannel = client.channels.cache.get(client.config.get("settings.channels.logs"));
    
        if (oldUserChannel === null && newUserChannel !== null) {
            const channelAndRole = voiceChannelsAndRoles.find(
                (entry) => entry.voiceChannelId === newUserChannel.id
            );
        
            if (channelAndRole) {
                const user = newState.member;
                const role = newState.guild.roles.cache.get(channelAndRole.roleId);
        
                if (role) {
                    user.roles.add(role).then(() => {
                    console.log(`✅ | Rôle ajouté à ${user.user.tag}`);
                        const embed = client.buildEmbed(`<:check:1127558175042850926> | Rôle ajouté à ${user.user.tag}`, false).setColor("#31E85C");
                        logChannel.send({ embeds: [embed] });
                    }).catch(console.error);
                } else {
                    console.error(`❌ | Rôle avec l'ID ${channelAndRole.roleId} non trouvé.`);
                    const embed = client.buildEmbed(`<:cross:1127558177039319131> | Rôle avec l'ID ${channelAndRole.roleId} non trouvé.`, false).setColor("#31E85C");
                    logChannel.send({ embeds: [embed] });
                }
            }
        } else if (oldUserChannel !== null && newUserChannel === null) {
            const channelAndRole = voiceChannelsAndRoles.find(
                (entry) => entry.voiceChannelId === oldUserChannel.id
            );
        
            if (channelAndRole) {
                const user = oldState.member;
                const role = oldState.guild.roles.cache.get(channelAndRole.roleId);
        
                if (role) {
                    user.roles.remove(role).then(() => {
                        console.log(`✅ | Rôle supprimé de ${user.user.tag}`);
                        const embed = client.buildEmbed(`<:check:1127558175042850926> | Rôle supprimé de ${user.user.tag}`, false).setColor("#31E85C");
                        logChannel.send({ embeds: [embed] });
                    }).catch(console.error);
                } else {
                    console.error(`❌ | Rôle avec l'ID ${channelAndRole.roleId} non trouvé.`);
                    const embed = client.buildEmbed(`<:cross:1127558177039319131> | Rôle avec l'ID ${channelAndRole.roleId} non trouvé.`, false).setColor("#31E85C");
                    logChannel.send({ embeds: [embed] });
                }
            }
        } else if (oldUserChannel !== null && newUserChannel !== null && oldUserChannel.id !== newUserChannel.id) {
            const oldChannelAndRole = voiceChannelsAndRoles.find(
                (entry) => entry.voiceChannelId === oldUserChannel.id
            );
        
            if (oldChannelAndRole) {
                const user = oldState.member;
                const role = oldState.guild.roles.cache.get(oldChannelAndRole.roleId);
        
                if (role) {
                    user.roles.remove(role).then(() => {
                        console.log(`✅ | Rôle supprimé de ${user.user.tag}`);
                        const embed = client.buildEmbed(`<:check:1127558175042850926> | Rôle supprimé de ${user.user.tag}`, false).setColor("#31E85C");
                        logChannel.send({ embeds: [embed] });
                    }).catch(console.error);
                } else {
                    console.error(`❌ | Rôle avec l'ID ${oldChannelAndRole.roleId} non trouvé.`);
                    const embed = client.buildEmbed(`<:cross:1127558177039319131> | Rôle avec l'ID ${oldChannelAndRole.roleId} non trouvé.`, false).setColor("#31E85C");            
                    logChannel.send({ embeds: [embed] });
                }
            }
        
            const newChannelAndRole = voiceChannelsAndRoles.find(
                (entry) => entry.voiceChannelId === newUserChannel.id
            );
        
            if (newChannelAndRole) {
                const user = newState.member;
                const role = newState.guild.roles.cache.get(newChannelAndRole.roleId);
        
                if (role) {
                    user.roles.add(role).then(() => {
                        console.log(`✅ | Rôle ajouté à ${user.user.tag}`);
                        const embed = client.buildEmbed(`<:check:1127558175042850926> | Rôle ajouté à ${user.user.tag}`, false).setColor("#31E85C");
                        logChannel.send({ embeds: [embed] });
                    }).catch(console.error);
                } else {
                    console.error(`❌ | Rôle avec l'ID ${newChannelAndRole.roleId} non trouvé.`);
                    const embed = client.buildEmbed(`<:cross:1127558177039319131> | Rôle avec l'ID ${newChannelAndRole.roleId} non trouvé.`, false).setColor("#31E85C");
                    logChannel.send({ embeds: [embed] });
                }
            }
        }
    },
};