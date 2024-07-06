const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Подает жалобу на пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь на которого подается жалоба')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Причина жалобы')
                .setRequired(true)),
    async execute(interaction) {
        const reporter = interaction.user;
        const reportedUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const reportChannelId = '1258135589664850171';
        const reportChannel = interaction.client.channels.cache.get(reportChannelId);

        if (!reportChannel) {
            return interaction.reply({ content: 'Канал для жалоб не найден.', ephemeral: true });
        }

        const reportEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Новая жалоба')
            .addFields(
                { name: 'Жалоба от', value: reporter.tag, inline: true },
                { name: 'На пользователя', value: reportedUser.tag, inline: true },
                { name: 'Причина', value: reason },
                { name: 'Дата и время', value: new Date().toLocaleString(), inline: true }
            )
            .setFooter({ text: `ID жалобщика: ${reporter.id}` });

        await reportChannel.send({ embeds: [reportEmbed] });

        const userEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription('>>> Ваша жалоба была успешно подана. Ожидайте ответа.');

        await interaction.reply({ embeds: [userEmbed], ephemeral: true });
    },
};

