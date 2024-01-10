module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (interaction.guild.id !== client.config.get("settings.guild_id")) {
            const embed = client.buildEmbed('Cette commande est réservée à un serveur spécifique.', true)
                .setColor('#FF0000')
                .setTitle('<:cross:1127558177039319131> | Commande non disponible');
            return interaction.reply({ embeds: [embed] });
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    },
};