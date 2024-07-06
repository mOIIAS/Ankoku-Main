const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link_manage')
        .setDescription('Управление приглашениями пользователей (для администраторов)')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    async execute(interaction) {
        const guild = interaction.guild;
        const roleID = '1241628343141400636';

        // Check if the user has the required role_images
        if (!interaction.member.roles.cache.has(roleID)) {
            return interaction.reply({ content: 'У вас нет прав для использования этой команды.', ephemeral: true });
        }

        // Fetch all invites from the guild
        const invites = await guild.invites.fetch();
        const inviteUsage = {};

        invites.forEach(invite => {
            const inviter = invite.inviter;
            if (!inviter) return;

            if (!inviteUsage[inviter.id]) {
                inviteUsage[inviter.id] = {
                    tag: inviter.tag,
                    users: new Set(),
                };
            }

            // Add each unique user invited by this inviter to the set
            invite.invitees?.forEach(invitee => inviteUsage[inviter.id].users.add(invitee.id));
        });

        const sortedUsage = Object.values(inviteUsage).sort((a, b) => b.users.size - a.users.size);
        const usageDescriptions = sortedUsage.map(inv => `\`\`\`${inv.tag}: ${inv.users.size} приглашений\`\`\``).join('\n');

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Управление приглашениями')
            .setDescription(`>>> ${usageDescriptions}`);

        await interaction.reply({ embeds: [embed] });
    },
};
