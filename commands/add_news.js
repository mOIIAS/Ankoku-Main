const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_news')
        .setDescription('Добавить новость (только для ролей с определенным ID)')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Заголовок новости')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Описание новости')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Цвет Embed (например, #FF0000)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('gif')
                .setDescription('Ссылка на GIF (Tenor)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('ping')
                .setDescription('Пинг (например, @everyone или @here)')
                .setRequired(false)),
    async execute(interaction) {
        const roleID = '1241628343141400636';
        const newsChannelID = '1258131660541792386';

        // Check if the user has the required role_images
        if (!interaction.member.roles.cache.has(roleID)) {
            return interaction.reply({ content: 'У вас нет прав для использования этой команды.', ephemeral: true });
        }

        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const color = interaction.options.getString('color');
        const ping = interaction.options.getString('ping') || '';
        const gif = interaction.options.getString('gif');

        const newsEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setDescription(description)
            .setImage(gif)
            .setThumbnail('https://media1.tenor.com/m/oxO_vKTaeqcAAAAC/sailor-moon-black-lady.gif') // Replace with actual thumbnail URL
            .setFooter({ text: 'ANKOKU | News', iconURL: 'https://media1.tenor.com/m/oxO_vKTaeqcAAAAC/sailor-moon-black-lady.gif' }) // Replace with actual footer icon URL
            .setTimestamp();

        const newsChannel = interaction.guild.channels.cache.get(newsChannelID);
        if (!newsChannel) {
            return interaction.reply({ content: 'Канал для новостей не найден.', ephemeral: true });
        }

        // Send the news message
        await newsChannel.send({ content: ping, embeds: [newsEmbed] });
        await interaction.reply({ content: 'Новость успешно опубликована!', ephemeral: true });
    },
};

