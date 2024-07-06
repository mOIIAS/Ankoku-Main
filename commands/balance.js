const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Показывает баланс пользователя'),
    async execute(interaction) {
        const user = interaction.user;
        const userAvatar = user.displayAvatarURL();

        // Получаем баланс пользователя из глобальной переменной
        const userBalance = global.userBalances[user.id] || 0;

        const balanceEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Баланс пользователя')
            .setDescription(`\`\`\`Баланс: ${userBalance} монет\`\`\``)
            .setThumbnail(userAvatar)
            .setFooter({ text: user.tag });

        await interaction.reply({ embeds: [balanceEmbed] });
    },
};

