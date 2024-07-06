const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_delete_zam')
        .setDescription('Удаляет совладельца канала')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которого нужно удалить как совладельца')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const user = interaction.options.getUser('user');
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы удалить совладельца.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете удалять совладельцев только из каналов под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете удалять совладельцев в этом канале, так как вы не являетесь его создателем.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.delete(user.id);
            await interaction.reply({ content: `Пользователь ${user.tag} удален как совладелец канала.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при удалении совладельца.', ephemeral: true });
        }
    },
};

