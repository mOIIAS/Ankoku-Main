const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link_friends')
        .setDescription('Показывает, сколько человек вы пригласили'),
    async execute(interaction) {
        const user = interaction.user;
        const inviteLink = 'https://discord.gg/DP68W2bv';
        const guild = interaction.guild;

        // Fetch all invites from the guild
        const invites = await guild.invites.fetch();

        // Find the invite matching the specific link
        const invite = invites.find(inv => inv.code === inviteLink.split('/').pop());

        if (!invite) {
            return interaction.reply({ content: 'Пригласительная ссылка не найдена.', ephemeral: true });
        }

        // Find the user's usage of the invite link
        const inviteCount = invite.uses || 0;

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Приглашенные друзья')
            .setDescription(`>>> Вы пригласили ${inviteCount} человек по ссылке ${inviteLink}.`);

        await interaction.reply({ embeds: [embed] });
    },
};
