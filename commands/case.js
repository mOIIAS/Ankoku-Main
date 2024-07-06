const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('case')
        .setDescription('Открыть кейс'),
    async execute(interaction) {
        const user = interaction.user;
        const userId = user.id;

        if (!global.userCases[userId] || global.userCases[userId] <= 0) {
            await interaction.reply({ content: 'У вас нет кейсов для открытия.', ephemeral: true });
            return;
        }

        const rewards = [
            { coins: 100, chance: 80 },
            { coins: 200, chance: 50 },
            { coins: 350, chance: 30 },
            { coins: 550, chance: 20 },
            { coins: 700, chance: 10 },
            { coins: 1000, chance: 5 },
            { coins: 1500, chance: 3 },
            { coins: 5000, chance: 1 },
        ];

        const totalChance = rewards.reduce((acc, reward) => acc + reward.chance, 0);
        const randomChance = Math.random() * totalChance;

        let accumulatedChance = 0;
        let reward = rewards[0];

        for (let i = 0; i < rewards.length; i++) {
            accumulatedChance += rewards[i].chance;
            if (randomChance < accumulatedChance) {
                reward = rewards[i];
                break;
            }
        }

        if (!global.userBalances[userId]) {
            global.userBalances[userId] = 0;
        }

        global.userBalances[userId] += reward.coins;
        global.userCases[userId] -= 1;

        const caseEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Открытие кейса')
            .setDescription(`\`\`\`Поздравляем! Вы выиграли ${reward.coins} монет!\nУ вас осталось ${global.userCases[userId]} кейсов.\`\`\``)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: user.tag });

        await interaction.reply({ embeds: [caseEmbed], ephemeral: true });
    },
};
