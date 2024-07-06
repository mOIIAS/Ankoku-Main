const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_case')
        .setDescription('Купить кейс за 400 монет'),
    async execute(interaction) {
        const user = interaction.user;
        const userId = user.id;

        // Initialize global variables if they are not defined
        if (!global.userBalances) {
            global.userBalances = {};
        }
        if (!global.userCases) {
            global.userCases = {};
        }

        if (global.userBalances[userId] < 400) {
            await interaction.reply({ content: 'У вас недостаточно монет, чтобы купить кейс. Вам нужно 400 монет.', ephemeral: true });
            return;
        }

        global.userBalances[userId] -= 400;

        if (!global.userCases[userId]) {
            global.userCases[userId] = 0;
        }

        global.userCases[userId] += 1;

        const buyCaseEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Покупка кейса')
            .setDescription(`Вы успешно купили кейс! Теперь у вас ${global.userCases[userId]} кейсов.`)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: user.tag });

        await interaction.reply({ embeds: [buyCaseEmbed], ephemeral: true });
    },
};
