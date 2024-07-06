const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_rename')
        .setDescription('Изменяет название голосового канала')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Новое название голосового канала')
                .setRequired(true)),
    async execute(interaction) {
        const newName = interaction.options.getString('name');
        const member = interaction.member;
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы изменить его название.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете изменять название только в каналах под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете изменить название этого канала, так как вы не являетесь его создателем.', ephemeral: true });
        }

        try {
            await channel.setName(newName);
            await interaction.reply({ content: `Название канала изменено на ${newName}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при изменении названия канала.', ephemeral: true });
        }
    },
};

