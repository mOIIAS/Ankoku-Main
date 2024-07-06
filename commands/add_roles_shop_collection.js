const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_roles_shop_collection')
        .setDescription('Добавить роль в коллекцию ролей для продажи')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Роль, которую нужно добавить')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('price')
                .setDescription('Цена роли')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('Ссылка на изображение (например: https://i.imgur.com/nFooggl.png)')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        const price = interaction.options.getInteger('price');
        const imageUrl = interaction.options.getString('image_url');
        const member = interaction.member;

        // Role ID that is authorized to use this command
        const authorizedRoleId = '1241628343141400636';

        // Check if the user has the authorized role
        if (!member.roles.cache.has(authorizedRoleId)) {
            return interaction.reply({ content: 'У вас нет прав для использования этой команды.', ephemeral: true });
        }

        const rolesShopPath = path.resolve(__dirname, '../roles_shop.json');

        // Create the roles shop file if it does not exist
        if (!fs.existsSync(rolesShopPath)) {
            fs.writeFileSync(rolesShopPath, JSON.stringify({ roles: [] }, null, 2));
        }

        let rolesShopData;
        try {
            const fileContents = fs.readFileSync(rolesShopPath, 'utf8');
            rolesShopData = fileContents ? JSON.parse(fileContents) : { roles: [] };
        } catch (error) {
            console.error('Error reading or parsing roles_shop.json:', error);
            return interaction.reply({ content: 'Ошибка при чтении файла магазина ролей.', ephemeral: true });
        }

        // Check if the role already exists in the shop
        if (rolesShopData.roles.some(r => r.id === role.id)) {
            return interaction.reply({ content: 'Эта роль уже существует в магазине ролей.', ephemeral: true });
        }

        // Add the role to the shop
        rolesShopData.roles.push({ id: role.id, amount: price, imageUrl: imageUrl });
        fs.writeFileSync(rolesShopPath, JSON.stringify(rolesShopData, null, 2));

        await interaction.reply({ content: `Роль ${role.name} была добавлена в магазин ролей с ценой ${price} монет и изображением.`, ephemeral: true });

        // Trigger roles_coll command update
        const rolesCollCommand = interaction.client.commands.get('roles_coll');
        if (rolesCollCommand) {
            const fakeInteraction = {
                user: interaction.user,
                reply: async (msg) => {
                    console.log('Updating role collection:', msg);
                }
            };
            await rolesCollCommand.execute(fakeInteraction);
        }
    },
};
