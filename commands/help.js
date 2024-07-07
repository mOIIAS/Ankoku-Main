const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Задает вопрос в канал помощи')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Ваш вопрос')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const question = interaction.options.getString('question');
        const helpChannelId = '1259524367507787837';
        const helpChannel = interaction.guild.channels.cache.get(helpChannelId);

        if (!helpChannel || helpChannel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'Канал помощи не найден.', ephemeral: true });
        }

        const questionEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Новый вопрос')
            .setDescription(`>>> **Пользователь:** ${user.tag}\n**Вопрос:** ${question}`);

        const sentMessage = await helpChannel.send({ embeds: [questionEmbed] });

        await interaction.reply({ content: 'Ваш вопрос был отправлен.', ephemeral: true });

        // Create a message collector for responses
        const filter = response => response.reference && response.reference.messageId === sentMessage.id;
        const collector = helpChannel.createMessageCollector({ filter, time: 86400000 }); // 24 hours

        collector.on('collect', async response => {
            const answerEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`>>> **Вам ответили!**\n**Ответ:** ${response.content}`);

            await user.send({ embeds: [answerEmbed] });

            const responseEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`>>> **Ответ на вопрос от ${user.tag}**\n**Ответ:** ${response.content}`);

            await response.reply({ embeds: [responseEmbed] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                const timeoutEmbed = new EmbedBuilder()
                    .setColor(0x000000)
                    .setDescription('>>> Время ожидания ответа истекло.');

                helpChannel.send({ embeds: [timeoutEmbed] });
            }
        });
    },
};
