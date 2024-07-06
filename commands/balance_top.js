const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance_top')
        .setDescription('Показывает топ пользователей по балансу'),
    async execute(interaction) {
        const users = Object.keys(global.userBalances);
        const sortedUsers = users.sort((a, b) => global.userBalances[b] - global.userBalances[a]);
        const topUsers = sortedUsers.slice(0, 25); // Всего 25 пользователей на 5 страниц

        const pages = [];
        for (let i = 0; i < 5; i++) {
            const start = i * 5;
            const end = start + 5;
            const pageUsers = topUsers.slice(start, end);

            const embed = new EmbedBuilder()
                .setColor(0x000000)
                .setImage('https://media1.tenor.com/m/d22iiZtwHtIAAAAC/sad-crying.gif')
                .setTitle(`Топ пользователей по балансу`);

            for (let j = 0; j < pageUsers.length; j++) {
                const userId = pageUsers[j];
                const user = await interaction.client.users.fetch(userId);
                embed.addFields(
                    { name: `#${start + j + 1}`, value: `${user.tag} - ${global.userBalances[userId]} монет`, inline: true }
                );
            }

            pages.push(embed);
        }

        let currentPage = 0;

        const message = await interaction.reply({ embeds: [pages[currentPage]], fetchReply: true });

        if (pages.length > 1) {
            await message.react('⬅️');
            await message.react('➡️');

            const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && !user.bot;
            const collector = message.createReactionCollector({ filter, time: 60000 });

            collector.on('collect', (reaction) => {
                reaction.users.remove(interaction.user);

                if (reaction.emoji.name === '⬅️') {
                    currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
                } else if (reaction.emoji.name === '➡️') {
                    currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
                }

                message.edit({ embeds: [pages[currentPage]] });
            });

            collector.on('end', () => {
                message.reactions.removeAll();
            });
        }
    },
};

