const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// ID пользователя, который имеет право использовать команду
const ALLOWED_USER_ID = '1051492248816205844';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles_coll')
        .setDescription('for admin'),
    async execute(interaction) {
        // Проверка разрешенного пользователя
        if (interaction.user.id !== ALLOWED_USER_ID) {
            return interaction.reply({
                content: 'У вас нет разрешения использовать эту команду.',
                ephemeral: true
            });
        }

        const rolesShopPath = path.resolve(__dirname, '../roles_shop.json');

        // Создание файла, если он не существует
        if (!fs.existsSync(rolesShopPath)) {
            fs.writeFileSync(rolesShopPath, JSON.stringify({ roles: [] }, null, 2));
        }

        let rolesShopData;
        try {
            const fileContents = fs.readFileSync(rolesShopPath, 'utf8');
            rolesShopData = fileContents ? JSON.parse(fileContents) : { roles: [] };
        } catch (error) {
            console.error('Ошибка при чтении или парсинге roles_shop.json:', error);
            return interaction.reply({ content: 'Ошибка при чтении файла магазина ролей.', ephemeral: true });
        }

        if (rolesShopData.roles.length === 0) {
            return interaction.reply({ content: 'В магазине ролей нет доступных ролей.', ephemeral: true });
        }

        const embeds = rolesShopData.roles.map(role => {
            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setTitle(`Роль: ${role.id}`) // Only the role ID here, no mention
                .setDescription(`Цена: ${role.amount} монет\nРоль: <@&${role.id}>`) // Mention the role in the description
                .setImage(role.imageUrl);

            return embed;
        });

        await interaction.reply({ embeds: embeds });
    },
};











