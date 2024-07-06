const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

let marriages = new Map(); // Глобальная переменная для хранения информации о браках

const MARRIED_ROLE_ID = '1258422403407548466'; // ID роли для женатых

module.exports = {
    data: new SlashCommandBuilder()
        .setName('marry')
        .setDescription('Отправляет запрос на брак пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Пользователь, которому вы хотите сделать предложение')
                .setRequired(true)),
    async execute(interaction) {
        const proposer = interaction.user;
        const proposed = interaction.options.getUser('user');

        if (proposer.id === proposed.id) {
            return interaction.reply({ content: 'Вы не можете жениться на себе.', ephemeral: true });
        }

        const marryEmbed = new EmbedBuilder()
            .setColor(0x000000)
            .setImage('https://media1.tenor.com/m/wWFm70VeC7YAAAAC/hug-darker-than-black.gif')
            .setDescription(`>>> ${proposer.tag} хочет пожениться с вами!`);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Принять')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('decline')
                    .setLabel('Отказаться')
                    .setStyle(ButtonStyle.Danger)
            );

        const message = await interaction.reply({ content: proposed.toString(), embeds: [marryEmbed], components: [row], fetchReply: true });

        const filter = i => i.user.id === proposed.id;
        const collector = message.createMessageComponentCollector({ filter, max: 1, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'accept') {
                const guild = interaction.guild;
                const category = guild.channels.cache.get('1258134176650104894');

                if (!category) {
                    return i.update({ content: 'Категория для каналов не найдена.', components: [], embeds: [] });
                }

                const channelName = `${proposer.username} x ${proposed.username}`;
                const channel = await guild.channels.create({
                    name: channelName,
                    type: 2,  // Use the integer value 2 for voice channels
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: proposer.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
                        },
                        {
                            id: proposed.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak],
                        },
                    ],
                });

                // Сохранение информации о браке
                marriages.set(proposer.id, {
                    partnerId: proposed.id,
                    channelName: channelName,
                    createdAt: new Date(),
                    channelId: channel.id
                });

                marriages.set(proposed.id, {
                    partnerId: proposer.id,
                    channelName: channelName,
                    createdAt: new Date(),
                    channelId: channel.id
                });

                // Выдача роли
                const proposerMember = await guild.members.fetch(proposer.id);
                const proposedMember = await guild.members.fetch(proposed.id);

                await proposerMember.roles.add(MARRIED_ROLE_ID);
                await proposedMember.roles.add(MARRIED_ROLE_ID);

                const acceptedEmbed = new EmbedBuilder()
                    .setColor(0x000000)
                    .setDescription(`>>> ${proposer.tag} и ${proposed.tag} теперь женаты! Канал создан: ${channel.toString()}`);

                await i.update({ embeds: [acceptedEmbed], components: [] });
            } else if (i.customId === 'decline') {
                const declinedEmbed = new EmbedBuilder()
                    .setColor(0x000000)
                    .setDescription(`>>> ${proposed.tag} отказался(ась) от предложения.`);

                await i.update({ embeds: [declinedEmbed], components: [] });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: 'Время ожидания ответа истекло.', components: [], embeds: [] });
            }
        });
    },
};

