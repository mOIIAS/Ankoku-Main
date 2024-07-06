const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let marriages = new Map(); // Глобальная переменная для хранения информации о браках

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love_profile')
        .setDescription('Показывает информацию о текущем браке пользователя'),
    async execute(interaction) {
        const user = interaction.user;
        const marriage = marriages.get(user.id);

        if (!marriage) {
            return interaction.reply({ content: 'Вы не состоите в браке.', ephemeral: true });
        }

        const partner = interaction.guild.members.cache.get(marriage.partnerId);

        // Формируем сообщение о браке
        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('Информация о вашем браке')
            .addFields(
                { name: 'Супруг(а)', value: partner ? partner.user.tag : 'Пользователь не найден', inline: true },
                { name: 'Время в браке', value: calculateTimeSince(marriage.createdAt), inline: true }
            );

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
};

// Функция для вычисления времени, проведенного в браке
function calculateTimeSince(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} дней`;
}
