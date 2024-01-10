const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kickall")
        .setDescription("Exclut un joueur de tous les serveurs.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription("L'id du joueur en question.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Le raison du kickall.')
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
        const kickedGuilds = [];
      
        const waitEmbed = client.buildEmbed("La commande `kickall` est en cours d'exécution. Veuillez patienter...", true)
            .setTitle('<:charg:1127608213030838292> | Commande en attente')
      
        const waitMessage = await interaction.reply({ embeds: [waitEmbed] });
      
        for (const guildId of guilds) {
            const guild = client.guilds.cache.get(guildId);
          try {
            const member = await guild.members.fetch(userId);
            await member.kick(reason);
            console.log(`Joueur exclu de ${guild.name} par ${interaction.user.tag}. Raison : ${reason}`);
            kickedGuilds.push(guild.name);
          } catch (error) {
            console.error(`Impossible d'exclure le joueur de ${guild.name} car il n'est pas présent sur ce serveur Discord.`);
          }
        }
      
        const user = client.users.cache.get(userId);
        const userName = user ? user.username : userId;
      
        const embed = client.buildEmbed(`Le joueur ${userName} a été exclu de tous les serveurs suivants :\n${kickedGuilds.length == 0 ? "Aucun" : kickedGuilds.join(', ')}`, true)
          .setTitle('<:check:1127558175042850926> | Commande effectuée avec succès').setColor("#31E85C");
        waitMessage.edit({ embeds: [embed] });

    }
};