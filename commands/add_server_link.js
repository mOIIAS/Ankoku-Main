// commands/add_server_link.js
const { SlashCommandBuilder } = require('discord.js');

const allowedLinks = []; // Переместите это в соответствующее место, например, глобальный файл настроек или базу данных

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_server_link')
        .setDescription('Добавляет разрешённую ссылку на Discord сервер')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Ссылка на Discord сервер')
                .setRequired(true)),
    async execute(interaction) {
        const link = interaction.options.getString('link');
        const roleId = '1241628343141400636';

        if (!interaction.member.roles.cache.has(roleId)) {
            return interaction.reply({ content: 'У вас нет прав на выполнение этой команды.', ephemeral: true });
        }

        if (!link.includes('discord.gg/')) {
            return interaction.reply({ content: 'Пожалуйста, введите действительную ссылку на Discord сервер.', ephemeral: true });
        }

        allowedLinks.push(link);
        interaction.reply({ content: 'Ссылка успешно добавлена в список разрешённых.', ephemeral: true });
    },
};
