const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice_slot')
        .setDescription('Ограничивает количество слотов в голосовом канале за 1000 монет')
        .addIntegerOption(option =>
            option.setName('slot')
                .setDescription('Количество слотов')
                .setRequired(true)),
    async execute(interaction) {
        const slotCount = interaction.options.getInteger('slot');
        const member = interaction.member;
        const channel = member.voice.channel;

        if (!channel) {
            return interaction.reply({ content: 'Вы должны находиться в голосовом канале, чтобы ограничить количество слотов.', ephemeral: true });
        }

        if (channel.parentId !== '1258134465452965992') {
            return interaction.reply({ content: 'Вы можете ограничивать количество слотов только в каналах под определенной категорией.', ephemeral: true });
        }

        const channelOwner = channel.permissionOverwrites.cache.get(interaction.user.id);
        if (!channelOwner || !channelOwner.allow.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'Вы не можете ограничить количество слотов в этом канале, так как вы не являетесь его создателем.', ephemeral: true });
        }

        const userBalance = global.userBalances[interaction.user.id] || 0;
        if (userBalance < 1000) {
            return interaction.reply({ content: 'У вас недостаточно монет для этой операции.', ephemeral: true });
        }

        global.userBalances[interaction.user.id] -= 1000;

        try {
            await channel.setUserLimit(slotCount);
            await interaction.reply({ content: `Количество слотов в канале ограничено до ${slotCount}.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Произошла ошибка при ограничении количества слотов в канале.', ephemeral: true });
        }
    },
};
