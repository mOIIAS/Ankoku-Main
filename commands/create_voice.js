const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_voice')
        .setDescription('Создает голосовой канал с указанными пользователями')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название голосового канала')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Пользователи, которые могут заходить (через @)')
                .setRequired(true)),
    async execute(interaction) {
        const channelName = interaction.options.getString('name');
        const userMentions = interaction.options.getString('users').match(/<@!?(\d+)>/g);
        const userIds = userMentions ? userMentions.map(mention => mention.replace(/[<@!>]/g, '')) : [];

        if (userIds.length === 0) {
            return interaction.reply({ content: 'Необходимо указать хотя бы одного пользователя.', ephemeral: true });
        }

        const guild = interaction.guild;
        const category = guild.channels.cache.get('1258134465452965992'); // ID категории

        if (!category) {
            return interaction.reply({ content: 'Категория для каналов не найдена.', ephemeral: true });
        }

        try {
            const permissions = [
                {
                    id: guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect]
                },
                ...userIds.map(id => ({
                    id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak]
                })),
                {
                    id: interaction.user.id, // Разрешение для создателя канала
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect, PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.ManageChannels]
                }
            ];

            const channel = await guild.channels.create({
                name: channelName,
                type: 2, // Тип 2 - голосовой канал
                parent: category.id,
                permissionOverwrites: permissions,
            });

            const creator = interaction.user;
            const mentions = userMentions.join(' ');

            const createdEmbed = new EmbedBuilder()
                .setColor(0x000000)
                .setDescription(`>>> Канал создан!\nСоздатель: ${creator}\nПользователи: ${mentions}\nНазвание канала: ${channelName}`)
                .setFooter({ text: 'Если в канале никого не будет, он будет удален.' });

            await interaction.reply({ embeds: [createdEmbed] });

            // Проверка на присутствие пользователей и удаление канала, если он пустой
            setTimeout(async () => {
                const updatedChannel = await guild.channels.fetch(channel.id);
                if (updatedChannel && updatedChannel.members.size === 0) {
                    await updatedChannel.delete();
                    await interaction.followUp({ content: `Канал ${channelName} был удален, так как в нем никого не было.`, ephemeral: true });
                }
            }, 60000); // Проверка через 1 минуту

        } catch (error) {
            console.error(error);
            return interaction.reply({ content: 'Произошла ошибка при создании канала.', ephemeral: true });
        }
    },
};
