const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Показывает аватар пользователя')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, чей аватар нужно показать')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const avatarURL = user.displayAvatarURL({ size: 1024, dynamic: true });

        const avatarEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle(`Аватар пользователя ${user.tag}`)
            .setImage(avatarURL);

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
