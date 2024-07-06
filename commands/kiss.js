const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Глобальная переменная для хранения балансов пользователей
global.userBalances = global.userBalances || {};

const kissGifs = [
    'https://media.tenor.com/LOWcGLwNC2AAAAAM/dabi.gif',
    'https://media.tenor.com/cQzRWAWrN6kAAAAM/ichigo-hiro.gif',
    'https://media.tenor.com/g8AeFZoe7dsAAAAM/kiss-anime-kiss.gif',
    'https://media.tenor.com/C96g4M5OPsYAAAAM/anime-couple.gif',
    'https://media.tenor.com/BZyWzw2d5tAAAAAM/hyakkano-100-girlfriends.gif',
    'https://media.tenor.com/F02Ep3b2jJgAAAAM/cute-kawai.gif',
    'https://media.tenor.com/BmCMSjeA6pwAAAAM/anime-couple-kiss.gif',
    'https://media.tenor.com/9u2vmryDP-cAAAAM/horimiya-animes.gif',
    'https://media.tenor.com/SZ8-4vDwi6cAAAAM/miyamura-hori.gif',
    'https://media.tenor.com/HJLEYgQcvEAAAAAM/yosuga-no-sora-kiss.gif',
    'https://media.tenor.com/1TDajWHZF_IAAAAM/berran%C4%B1n-opucugu.gif',
    'https://media.tenor.com/b7DWF8ecBkIAAAAM/kiss-anime-anime.gif',
    'https://media.tenor.com/8mUI_rkXUuAAAAAM/kiss.gif',
    'https://media.tenor.com/woA_lrIFFAIAAAAM/girl-anime.gif',
    'https://media.tenor.com/XB3mEB77l7EAAAAM/kiss.gif',
    'https://media.tenor.com/vtOmnXkckscAAAAM/kiss.gif',
    'https://media.tenor.com/Gjv94meG9S0AAAAM/anime-kiss-anime.gif',
    'https://media.tenor.com/dn_KuOESmUYAAAAM/engage-kiss-anime-kiss.gif',
    'https://media.tenor.com/mNPxG38pPV0AAAAM/kiss-love.gif',
    'https://media.tenor.com/5iiiF4A7KI0AAAAM/anime-cry-anime.gif',
    'https://media.tenor.com/1D_SzXnb0D4AAAAM/namorando-namorados.gif',
    'https://media.tenor.com/Fyq9izHlreQAAAAM/my-little-monster-haru-yoshida.gif',
    'https://media.tenor.com/i_aRirM1g44AAAAM/food-anime.gif',
    'https://media.tenor.com/8ln6Z1e-FVYAAAAM/nagumi-koushi-hozumi-serene.gif',
    'https://media.tenor.com/QbYxVBr1p5MAAAAM/rikekoi-anime-love-kiss.gif',
    'https://media.tenor.com/G2pZQzmJnBcAAAAM/anime-kiss.gif',
    'https://media.tenor.com/APN_rYYwVCQAAAAM/runa-shirakawa-ryuuto-kashima.gif',
    'https://media.tenor.com/An_uRjYe3GUAAAAM/anime-kissing.gif',
    'https://media.tenor.com/2MZgbU7fxrUAAAAM/tomo-chan-is-a-girl-kiss-anime.gif',
    'https://media.tenor.com/lyuW54_wDU0AAAAM/kiss-anime.gif'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Поцеловать кого-то')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которого хотите поцеловать')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.user;
        const targetUser = interaction.options.getUser('user');

        // Проверка баланса
        const userBalance = global.userBalances[user.id] || 0;
        const cost = 10;

        if (userBalance < cost) {
            return interaction.reply({ content: 'Недостаточно монет для выполнения команды.', ephemeral: true });
        }

        // Снимаем монеты
        global.userBalances[user.id] -= cost;

        const randomGif = kissGifs[Math.floor(Math.random() * kissGifs.length)];

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle(`${user.username} поцеловал(а) ${targetUser.username}!`)
            .setImage(randomGif)

        await interaction.reply({ embeds: [embed] });
    },
};
