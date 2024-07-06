const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_add_zam')
        .setDescription('Добавляет совладельца для голосового канала')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которого нужно добавить как совладельца')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const user = interaction.options.getUser('user');
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы добавить совладельца.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете добавлять совладельца только в каналах под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете добавить совладельца в этот канал, так как вы не являетесь его создателем.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(user.id, {
                ManageChannels: true,
                ViewChannel: true,
                Connect: true,
                Speak: true,
            });
            await interaction.reply({ content: `Пользователь ${user.tag} добавлен как совладелец канала.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при добавлении совладельца.', ephemeral: true });
        }
    },
};
