module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        if (message.channel.id === client.config.get("settings.channels.auto_message") && message.author.id !== client.config.get("bot_id")) client.messageCount++;
    },
};