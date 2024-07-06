const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

let marriages = new Map(); // Глобальная переменная для хранения информации о браках

const MARRIED_ROLE_ID = '1258422403407548466'; // ID роли для женатых

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmarry')
        .setDescription('Развод с пользователем и удаление совместного канала')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, с которым вы хотите развестись')
                .setRequired(true)),
    async execute(interaction) {
        const proposer = interaction.user;
        const proposed = interaction.options.getUser('user');
        const guild = interaction.guild;

        if (proposer.id === proposed.id) {
            return interaction.reply({ content: 'Вы не можете развестись с самим собой.', ephemeral: true });
        }

        const channelName = `${proposer.username} x ${proposed.username}`;
        const channel = guild.channels.cache.find(ch => ch.name === channelName && ch.type === 2);

        if (!channel) {
            return interaction.reply({ content: 'Не найден канал, связанный с этой парой.', ephemeral: true });
        }

        await channel.delete()
            .then(async () => {
                // Удаление информации о браке
                marriages.delete(proposer.id);
                marriages.delete(proposed.id);

                // Удаление роли
                const proposerMember = await guild.members.fetch(proposer.id);
                const proposedMember = await guild.members.fetch(proposed.id);

                await proposerMember.roles.remove(MARRIED_ROLE_ID);
                await proposedMember.roles.remove(MARRIED_ROLE_ID);

                const divorcedEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription(`>>> ${proposer.tag} и ${proposed.tag} больше не женаты. Канал был удален.`);

                interaction.reply({ embeds: [divorcedEmbed], ephemeral: true });
            })
            .catch(err => {
                console.error(err);
                interaction.reply({ content: 'Произошла ошибка при удалении канала.', ephemeral: true });
            });
    },
};


