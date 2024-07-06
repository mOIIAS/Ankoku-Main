const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_add_user')
        .setDescription('Добавляет пользователя в голосовой канал')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которого нужно добавить в канал')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.member;
        const user = interaction.options.getUser('user');
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы добавить пользователя.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете добавлять пользователей только в каналы под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете добавить пользователя в этот канал, так как вы не являетесь его создателем.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(user.id, {
                ViewChannel: true,
                Connect: true,
                Speak: true,
            });
            await interaction.reply({ content: `Пользователь ${user.tag} добавлен в канал.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при добавлении пользователя.', ephemeral: true });
        }
    },
};
