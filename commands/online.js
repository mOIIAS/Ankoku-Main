const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('online')
        .setDescription('Показывает сколько людей сидят в голосовых каналах'),
    async execute(interaction) {
        const guild = interaction.guild;
        let onlineCount = 0;

        // Iterate over all voice channels in the guild
        guild.channels.cache.forEach(channel => {
            if (channel.type === 2) { // Voice channel
                onlineCount += channel.members.size;
            }
        });

        const onlineEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Люди в голосовых каналах')
            .setDescription(`>>> В голосовых каналах: ${onlineCount} человек`);

        await interaction.reply({ embeds: [onlineEmbed] });
    },
};
