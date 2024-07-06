const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Replace 'YOUR_USER_ID' with the actual user ID you want to restrict this command to
const ALLOWED_USER_ID = '1051492248816205844';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server_logg_admin')
        .setDescription('for admin'),
    async execute(interaction) {
        // Check if the user is allowed to use this command
        if (interaction.user.id !== ALLOWED_USER_ID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const shopEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Магазин')
            .setDescription(`
>>> **5р - 50 монет**
**Приватная роль 50р**
**Приватная комната с вашим названием 80р**

Все операции проходят у <@1002816005313146890>
      `);

        const shadowLordEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Владыка Теней')
            .setDescription(`
>>> Цена: **200** / **1000**
Срок: **месяц / навсегда**

**Возможности**
1) Заходить в полные румы
2) Отключать микрофон
3) Отключать звук
4) Отправлять сообщения с таймаутом
5) Приватная роль в подарок
6) Отображение над Moderator
      `);

        const darkShadowEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Чёрная тьма')
            .setDescription(`
>>> Цена: **500** / **2000**
Срок: **месяц / навсегда**

**Возможности**
1) Все возможности Владыки Теней
2) Отображение над ролью Куратор
3) 3 приватных роли в подарок
4) 2 приватные комнаты в подарок
5) 3000 монет в подарок
6) Возможность заходить в проходные
7) Просматривать некоторые каналы стафф
      `);

        const shadowFameEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Shadow Fame')
            .setImage('https://media1.tenor.com/m/bwYLvDUuqV4AAAAC/marin-kitagawa-kitagawa.gif')
            .setDescription(`
>>> Цена: **1500** / **3000**
Срок: **месяц / навсегда**

**Возможности**
1) Все права Владыки Теней / Чёрной тьмы
2) Отображение в самом верху сервера
3) Возможность вписать 2 друзей как Владыка Теней
4) Доступ ко всем каналам сервера
5) Возможность выдавать роли через ПКМ
6) Возможность использовать звуковую панель
      `);

        await interaction.reply({
            embeds: [shopEmbed, shadowLordEmbed, darkShadowEmbed, shadowFameEmbed]
        });
    },
};
