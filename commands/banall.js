const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("banall")
        .setDescription("Bannit un joueur de tous les serveurs.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription("L'id du joueur en question.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Le raison du banall.')
                .setRequired(false)),
    async execute(interaction, client) {

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)){
            const embed = client.buildEmbed("Vous n'avez pas la permission d'utiliser cette commande.", true)
            .setTitle('<:danger:1127558178486370314> | Permission manquante');
            return interaction.reply({ embeds: [embed] });
        }
      
        const userId = interaction.options.getString("user_id");
        const reason = interaction.options.getString("raison")?? "";
      
        const guilds = client.guilds.cache.keys();
        const bannedGuilds = [];
        const notPresentGuilds = [];

        const waitEmbed = client.buildEmbed('La commande `banall` est en cours d\'exécution. Veuillez patienter...')
            .setTitle('<:charg:1127608213030838292> | Commande en attente');
        const waitMessage = await interaction.reply({ embeds: [waitEmbed] });

        for (const guildId of guilds) {
            const guild = client.guilds.cache.get(guildId);
            try {
                const member = await guild.members.fetch(userId);
                await member.ban({ reason: reason });
                console.log(`Joueur banni de ${guild.name} par ${interaction.user.tag}. Raison : ${reason}`);
                bannedGuilds.push({
                    guildName: guild.name,
                    guildId: guild.id
                });
            } catch (error) {
                guild.members.ban(userId).catch(console.error);
                if (error.code === 10007) {
                    console.error(`Impossible de bannir le joueur de ${guild.name} car il n'est pas présent sur ce serveur Discord.`);
                    notPresentGuilds.push({
                        guildName: guild.name,
                        guildId: guild.id
                    });
                } else {
                    console.error(`Erreur lors du bannissement du joueur de ${guild.name}: ${error}`);
                }
            }
        }

        const bannedMember = interaction.guild.members.cache.get(userId) || { id: userId };
        const bannedUser = `<@${bannedMember.id}>`;
    
        let description = '';
        if (bannedGuilds.length > 0) {
            description += `Le joueur ${bannedUser} a été banni des serveurs suivants :\n`;
            for (const bannedGuild of bannedGuilds) {
                description += `Serveur : ${bannedGuild.guildName} (ID : ${bannedGuild.guildId})\n`;
            }
        }
        
        if (notPresentGuilds.length > 0) {
            const notPresentCount = notPresentGuilds.length;
            description += `Le joueur ${bannedUser} a été banni sur ${notPresentCount} serveur${notPresentCount > 1 ? 's' : ''} où il n'était pas présent.`;
        }
        
        if (bannedGuilds.length === 0 && notPresentGuilds.length === 0) {
            description += `Le joueur ${bannedUser} n'était présent sur aucun serveur mais a été banni.\n`;
        }
    
        const embed = client.buildEmbed(description, true)
            .setColor('#31E85C')
            .setTitle('<:check:1127558175042850926> | Commande effectuée avec succès');
        waitMessage.edit({ embeds: [embed] });
    }
};