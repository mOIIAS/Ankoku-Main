const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Игра на монетку')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь для игры')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сумма ставки')
                .setRequired(true)),
    async execute(interaction) {
        const challenger = interaction.user;
        const opponent = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (!global.userBalances[challenger.id] || global.userBalances[challenger.id] < amount) {
            return interaction.reply({ content: 'У вас недостаточно монет для этой ставки.', ephemeral: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Принять')
                    .setStyle(ButtonStyle.Success), // Изменено
                new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Отказать')
                    .setStyle(ButtonStyle.Danger) // Изменено
            );

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Coinflip Challenge')
            .setImage('https://media1.tenor.com/m/x6_a7YCuKKIAAAAC/black-rock-shooter-dawn-fall.gif')
            .setDescription(`${challenger} вызвал ${opponent} на игру с ставкой в ${amount} монет.`);

        await interaction.reply({ content: `${opponent}, вас вызвали на игру!`, embeds: [embed], components: [row] });

        const filter = i => i.user.id === opponent.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'accept') {
                if (!global.userBalances[opponent.id] || global.userBalances[opponent.id] < amount) {
                    return i.reply({ content: 'У вас недостаточно монет для этой ставки.', ephemeral: true });
                }

                const result = Math.random() < 0.5 ? challenger : opponent;

                global.userBalances[challenger.id] -= amount;
                global.userBalances[opponent.id] -= amount;
                global.userBalances[result.id] = (global.userBalances[result.id] || 0) + (amount * 2);

                const resultEmbed = new EmbedBuilder()
                    .setColor(0x000000)
                    .setImage('https://media1.tenor.com/m/cKgvp6BnB84AAAAC/anime-manga.gif')
                    .setTitle('Coinflip Result')
                    .setDescription(`${result} выиграл ${amount * 2} монет!`);

                await i.update({ embeds: [resultEmbed], components: [] });
                collector.stop();
            } else if (i.customId === 'decline') {
                await i.update({ content: `${opponent} отказался от вызова.`, components: [] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Вызов истек, никто не ответил.', components: [] });
            }
        });
    },
};

