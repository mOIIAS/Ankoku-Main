const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_delete_user')
        .setDescription('Удаляет пользователя из голосового канала')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которого нужно удалить из канала')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const user = interaction.options.getUser('user');
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы удалить пользователя.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете удалять пользователей только из каналов под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете удалить пользователя из этого канала, так как вы не являетесь его создателем.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(user.id, {
                ViewChannel: false,
                Connect: false,
                Speak: false,
            });
            await interaction.reply({ content: `Пользователь ${user.tag} удален из канала.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при удалении пользователя.', ephemeral: true });
        }
    },
};

