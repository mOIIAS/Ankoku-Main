const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Показывает баннер пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, чей баннер нужно показать')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const userProfile = await user.fetch();
        const bannerURL = userProfile.bannerURL({ size: 1024, dynamic: true });

        if (!bannerURL) {
            return interaction.reply({ content: 'Этот пользователь не имеет баннера.', ephemeral: true });
        }

        const bannerEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle(`Баннер пользователя ${user.tag}`)
            .setImage(bannerURL);

        await interaction.reply({ embeds: [bannerEmbed] });
    },
};
