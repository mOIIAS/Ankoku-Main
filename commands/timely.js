const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timely')
        .setDescription('Получить 150 монет каждые 24 часа'),
    async execute(interaction) {
        const user = interaction.user;
        const userId = user.id;
        const now = Date.now();

        // Initialize global variables if they are not defined
        if (!global.lastTimelyUsage) {
            global.lastTimelyUsage = {};
        }
        if (!global.userBalances) {
            global.userBalances = {};
        }

        // Проверяем, использовал ли пользователь команду в последние 24 часа
        if (global.lastTimelyUsage[userId] && (now - global.lastTimelyUsage[userId] < 24 * 60 * 60 * 1000)) {
            const timeLeft = 24 * 60 * 60 * 1000 - (now - global.lastTimelyUsage[userId]);
            const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

            await interaction.reply(`Вы уже использовали эту команду. Попробуйте снова через ${hoursLeft} часов и ${minutesLeft} минут.`);
            return;
        }

        // Обновляем время последнего использования команды
        global.lastTimelyUsage[userId] = now;

        // Добавляем монеты пользователю
        if (!global.userBalances[userId]) {
            global.userBalances[userId] = 0;
        }
        global.userBalances[userId] += 150;

        const timelyEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Ежедневная награда')
            .setDescription('Вы получили 150 монет!')
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: user.tag });

        await interaction.reply({ embeds: [timelyEmbed] });
    },
};
