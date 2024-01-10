const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Voir la liste des commandes disponibles.")
        .setDMPermission(false),
    async execute(interaction, client) {

        const helpEmbed = client.buildEmbed(null, true)
            .setTitle('<:infos:1090868045897019432> | Voici la liste des commandes disponibles :')
            .addFields(
            { name: '!banall <ID du joueur> [raison]', value: 'Bannit un joueur de tous les serveurs.' },
            { name: '!unbanall <ID du joueur> [raison]', value: 'Débannit un joueur de tous les serveurs.' },
            { name: '!kickall <ID du joueur> [raison]', value: 'Exclut un joueur de tous les serveurs.' },
            { name: 'Information Supplémentaire', value: "Le bot permet de classer les membres lors de leur arrivée en Attente BDA ou en Attente VISA. Il permet également d'ajouter automatiquement un rôle lorsqu'un utilisateur rejoint ou est déplacé dans un salon BDA. Ainsi, l'utilisateur pourra faire un partage d'écran dans un salon dans lequel il ne le voit pas. Lorsque l'utilisateur quitte le salon, le bot lui retirera le rôle Discord." },
            );
        interaction.reply({ embeds: [helpEmbed] });

    }
};