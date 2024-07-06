const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work_verify')
        .setDescription('Сгенерировать капчу для проверки'),
    async execute(interaction) {
        const user = interaction.user;
        const captcha = generateCaptcha();

        const captchaEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Проверка капчей')
            .setDescription(`>>> Ваша капча: **${captcha}**\nПожалуйста, ответьте на это сообщение с капчей, чтобы получить 0.1 монеты.`);

        const sentMessage = await interaction.reply({ embeds: [captchaEmbed], fetchReply: true });

        const filter = response => response.author.id === user.id && response.content === captcha;
        const collector = sentMessage.channel.createMessageCollector({ filter, max: 1, time: 60000 });

        collector.on('collect', async response => {
            if (!global.userBalances) global.userBalances = {};
            if (!global.userBalances[user.id]) global.userBalances[user.id] = 0;

            global.userBalances[user.id] += 0.1;

            const successEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`>>> Капча введена правильно! Ваш новый баланс: ${global.userBalances[user.id].toFixed(1)} монет.`);

            await response.reply({ embeds: [successEmbed] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(0x000000)
                    .setDescription('>>> Время для ввода капчи истекло. Пожалуйста, попробуйте снова.');

                sentMessage.edit({ embeds: [timeoutEmbed] });
            }
        });
    },
};
