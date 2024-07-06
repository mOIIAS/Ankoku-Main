const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_profile')
        .setDescription('Показывает информацию о ваших голосовых каналах'),
    async execute(interaction) {
        const guild = interaction.guild;
        const member = interaction.member;

        const voiceChannels = guild.channels.cache.filter(channel =>
            channel.type === 2 &&
            channel.parentId === '1258134465452965992' &&
            channel.permissionOverwrites.cache.has(interaction.user.id) &&
            channel.permissionOverwrites.cache.get(interaction.user.id).allow.has(PermissionsBitField.Flags.ManageChannels)
        );

        if (voiceChannels.size === 0) {
            return interaction.reply({ content: 'У вас нет голосовых каналов.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Ваши голосовые каналы')
            .setDescription('>>> Информация о ваших голосовых каналах:');

        voiceChannels.forEach(channel => {
            const owner = interaction.user.tag;
            const slots = channel.userLimit === 0 ? 'Без ограничений' : channel.userLimit;
            const createdAt = channel.createdAt.toLocaleString();
            const coOwners = channel.permissionOverwrites.cache.filter(overwrite =>
                overwrite.allow.has(PermissionsBitField.Flags.ManageChannels) &&
                overwrite.id !== interaction.user.id
            ).map(overwrite => `<@${overwrite.id}>`).join(', ') || 'Нет';

            embed.addFields({
                name: channel.name,
                value: `Создан: ${createdAt}\nСлоты: ${slots}\nСоздатель: ${owner}\nСовладельцы: ${coOwners}`
            });
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
