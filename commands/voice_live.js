const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

const permanentChannels = new Map(); // Используем Map для хранения информации о постоянных каналах

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_live')
        .setDescription('Делает голосовой канал постоянным за 5000 монет'),
    async execute(interaction) {
        const member = interaction.member;
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы сделать его постоянным.', ephemeral: true });
        }

        if (!channel.parentId === '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете изменить настройки только в каналах под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете сделать этот канал постоянным, так как вы не являетесь его создателем.', ephemeral: true });
        }

        const userBalance = global.userBalances[interaction.user.id] || 0;
        if (userBalance < 5000) {
            return interaction.reply({ content: 'У вас недостаточно монет для этой операции.', ephemeral: true });
        }

        global.userBalances[interaction.user.id] -= 5000;
        permanentChannels.set(channel.id, true); // Помечаем канал как постоянный

        try {
            await interaction.reply({ content: 'Канал теперь постоянный.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при изменении настроек канала.', ephemeral: true });
        }
    },
};
