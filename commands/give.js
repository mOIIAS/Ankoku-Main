const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Передает монеты другому пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Получатель монет')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма монет для передачи')
                .setRequired(true)),
    async execute(interaction) {
        const sender = interaction.user;
        const recipient = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (!global.userBalances[sender.id] || global.userBalances[sender.id] < amount) {
            return interaction.reply({ content: 'У вас недостаточно монет для передачи.', ephemeral: true });
        }
11
        global.userBalances[sender.id] -= amount;
        global.userBalances[recipient.id] = (global.userBalances[recipient.id] || 0) + amount;

        const sendEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Передача монет')
            .setDescription(`${sender} передал ${amount} монет ${recipient}.`);

        await interaction.reply({ embeds: [sendEmbed] });
    },
};
