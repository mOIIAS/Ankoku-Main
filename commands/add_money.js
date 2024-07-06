const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_money')
        .setDescription('Добавить монеты пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которому нужно добавить монеты')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Количество монет для добавления')
                .setRequired(true)),
    async execute(interaction) {
        const authorizedUserId = '1051492248816205844'; // ID пользователя, который может выдавать монеты
        const user = interaction.user;

        if (user.id !== authorizedUserId) {
            await interaction.reply({ content: 'Вы не имеете прав для выполнения этой команды.', ephemeral: true });
            return;
        }

        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (!global.userBalances[targetUser.id]) {
            global.userBalances[targetUser.id] = 0;
        }

        global.userBalances[targetUser.id] += amount;

        const addMoneyEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('Добавление монет')
            .setDescription(`\`\`\`Вы успешно добавили ${amount} монет пользователю ${targetUser.tag}.\nТеперь у него ${global.userBalances[targetUser.id]} монет.\`\`\``)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: user.tag });

        await interaction.reply({ embeds: [addMoneyEmbed], ephemeral: true });
    },
};
