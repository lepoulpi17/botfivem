const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unbanall")
        .setDescription("Débannit un joueur de tous les serveurs.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription("L'id du joueur en question.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription('Le raison du unbanall.')
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
        const unbannedGuilds = [];

        const waitEmbed = client.buildEmbed('La commande `unbanall` est en cours d\'exécution. Veuillez patienter...')
            .setTitle('<:charg:1127608213030838292> | Commande en attente');
        const waitMessage = await interaction.reply({ embeds: [waitEmbed] });

        for (const guildId of guilds) {
            const guild = client.guilds.cache.get(guildId);
            try {
                await guild.members.unban(userId, { reason });
                console.log(`Joueur débanni de ${guild.name} par ${interaction.user.tag}. Raison : ${reason}`);
                unbannedGuilds.push(guild.name);
            } catch (error) {
                console.error(`Impossible de débannir le joueur de ${guild.name}.`);
            }
        }

        const embed = client.buildEmbed(`Le joueur a été débanni de tous les serveurs suivants :\n${unbannedGuilds.length == 0 ? "Aucun" : unbannedGuilds.join(', ')}`, true)
            .setColor('#31E85C')
            .setTitle('<:check:1127558175042850926> | Commande effectuée avec succès')
        waitMessage.edit({ embeds: [embed] });
    }
};