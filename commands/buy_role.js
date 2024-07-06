const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy_role')
        .setDescription('Покупает роль за монеты')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Роль, которую вы хотите купить')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const role = interaction.options.getRole('role');
        const roleId = role.id;
        const userBalance = global.userBalances[user.id] || 0;

        // Загрузка данных из roles_shop.json
        const rolesShopPath = path.resolve(__dirname, '../roles_shop.json');

        // Создаем файл, если он не существует
        if (!fs.existsSync(rolesShopPath)) {
            fs.writeFileSync(rolesShopPath, JSON.stringify({ roles: [] }, null, 2));
        }

        const rolesShopData = JSON.parse(fs.readFileSync(rolesShopPath, 'utf8'));

        // Найти роль по ID
        const roleData = rolesShopData.roles.find(r => r.id === roleId);

        if (!roleData) {
            return interaction.reply({ content: `Роль ${role.name} не продается.`, ephemeral: true });
        }

        // Проверяем, хватает ли у пользователя денег на покупку
        if (userBalance < roleData.amount) {
            return interaction.reply({ content: `У вас недостаточно монет для покупки роли ${role.name}. Вам нужно ${roleData.amount} монет, а у вас ${userBalance}.`, ephemeral: true });
        }

        // Снимаем монеты с баланса пользователя
        global.userBalances[user.id] -= roleData.amount;

        // Добавляем роль пользователю
        const member = interaction.guild.members.cache.get(user.id);
        await member.roles.add(roleId);

        return interaction.reply({ content: `Вы успешно купили роль ${role.name} за ${roleData.amount} монет. Ваш новый баланс: ${global.userBalances[user.id]} монет.`, ephemeral: true });
    },
};
