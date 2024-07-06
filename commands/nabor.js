const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('n')
        .setDescription('Submit an application for a server role'),
    async execute(interaction, client) {
        const allowedUserId = '1051492248816205844';

        // Check if the user is the allowed user
        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({ content: 'У вас нет прав для использования этой команды.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setImage('https://media1.tenor.com/m/K4CE0d1NrLcAAAAC/liz-and-the-blue-bird-liz.gif')
            .setDescription(`
>>> **У нас активно идет набор на стафф! Если вы старше 14 лет и готовы уделять нашему серверу 3 часа своего времени и отлично знаете правила, тогда вы нам подходите. Подавайте заявку, нажав на кнопку снизу.**
<@&1252588831601856544> - человек, который отвечает за верификацию пользователей.
<@&1253596551306154004> - следит за всеми текстовыми чатами.
<@&1253596515042201681> - следит за голосовыми каналами сервера.
<@&1253596449384431616> - занимается продвижением сервера во всех аспектах.
<@&1258340748663980032> - делает трибуны для вас.
            `);

        const roles = [
            { label: 'Support', value: 'Support' },
            { label: 'Media', value: 'Media' },
            { label: 'Control', value: 'Control' },
            { label: 'TribuneMod', value: 'TribuneMod' },
            { label: 'Moderator', value: 'Moderator' }
        ];

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectRole')
                    .setPlaceholder('Выберите роль')
                    .addOptions(roles),
            );

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
    },
    async handleSelectMenu(interaction, client) {
        if (interaction.customId === 'selectRole') {
            const selectedRole = interaction.values[0];

            const modal = new ModalBuilder()
                .setCustomId(`applicationModal_${selectedRole}`)
                .setTitle(`Application for ${selectedRole}`)
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('applicationNameAge')
                            .setLabel('Имя и возраст')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('applicationRulesKnowledge')
                            .setLabel('Знания правил сервера (0/10)')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('applicationReason')
                            .setLabel('Почему мы должны выбрать вас?')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('applicationDiscordTime')
                            .setLabel('Пик онлайна в дискорде')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('applicationDevice')
                            .setLabel('У вас телефон либо ПК?')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
                );

            await interaction.showModal(modal);
        }
    },
    async handleModalSubmit(interaction, client) {
        const selectedRole = interaction.customId.split('_')[1]; // Get the role from the custom ID
        const nameAge = interaction.fields.getTextInputValue('applicationNameAge');
        const rulesKnowledge = interaction.fields.getTextInputValue('applicationRulesKnowledge');
        const reason = interaction.fields.getTextInputValue('applicationReason');
        const discordTime = interaction.fields.getTextInputValue('applicationDiscordTime');
        const device = interaction.fields.getTextInputValue('applicationDevice');

        const applicationChannel = await client.channels.fetch('1258334360956960838');

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`Новая заявка на роль ${selectedRole}`)
            .addFields(
                { name: 'Имя и возраст', value: nameAge, inline: true },
                { name: 'Знания правил сервера (0/10)', value: rulesKnowledge, inline: true },
                { name: 'Почему мы должны выбрать вас?', value: reason, inline: false },
                { name: 'Пик онлайна в дискорде', value: discordTime, inline: true },
                { name: 'У вас телефон либо ПК?', value: device, inline: true },
                { name: 'Пользователь', value: interaction.user.tag, inline: true }
            );

        await applicationChannel.send({ embeds: [embed] });

        await interaction.reply({ content: 'Ваша заявка была отправлена!', ephemeral: true });
    }
};


