const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_close')
        .setDescription('Делает голосовой канал недоступным для всех'),
    async execute(interaction) {
        const member = interaction.member;
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы сделать его недоступным для всех.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете делать каналы недоступными только под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете сделать этот канал недоступным для всех, так как вы не являетесь его создателем.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.create(channel.guild.roles.everyone, {
                ViewChannel: false,
                Connect: false,
                Speak: false
            });
            await interaction.reply({ content: 'Канал теперь недоступен для всех.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при изменении настроек канала.', ephemeral: true });
        }
    },
};
