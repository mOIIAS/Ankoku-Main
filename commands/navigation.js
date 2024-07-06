const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Replace 'YOUR_USER_ID' with the actual user ID you want to restrict this command to
const ALLOWED_USER_ID = '1051492248816205844';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed_navigation')
        .setDescription('for admin'),
    async execute(interaction) {
        // Check if the user is allowed to use this command
        if (interaction.user.id !== ALLOWED_USER_ID) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setImage('https://media1.tenor.com/m/0VELSdM2yucAAAAC/black-aesthetic-gif.gif')
            .setDescription(`
>>> **Навигация:**
<#1241631227384037447> - тут вы можете найти всю информацию об правилах нашего сервера!
<#1251876047650295828> - покупка монет либо приватных ролей/комнат.
<#1253598103294971914> - набор на стафф роли, обязательно прочитайте требования!
<#1258131660541792386> - новости нашего дискорд сервера.
<#1241613015116284016> - общение с другими участниками сервера и обсуждение интересов.
<#1246673284230152275> - канал для команд бота.
<#1258133014840479765> - канал для поиска своей любви (18+).
<#1251897336591024208> - канал для фото участников, чтобы показать себя.
<#1258132303159230525> - канал для поиска тиммейтов в разные игры.
<#1258369226452766720> - наши партнёры сервера.
<#1258131773360177233> - роли которые доступны для покупки.
**Команды:**
/balance - проверить баланс пользователя.
/give [user] - передать свои монеты другому пользователю.
/avatar [user] - посмотреть аватарку пользователя.
/banner [user] - баннер пользователя.
/balance_top - показывает мажоров сервера.
/buy_case - купить кейс за 400 монет.
/case - открыть кейс.
/buy_role [role] - купить роль все роли смотреть в канале <#1258131773360177233>.
/coinflip [user] [amount] - кинуть орёл и решку .
/create_voice [name] [users] - cделать приватный войс.
/kiss [user] - поцеловать участника сервера.
/help [question] - задать вопрос в поддержку.
/link_friends - проверить своих рефералов.
/marry [user] - пожениться с пользователем(+лав рума).
/unmarry [user] - расторгнуть брак с пользователем.
/online - проверить пользователей в голосовых каналах.
/report [user] [reason] - кинуть репорт на пользователя.
/timely - получить 150 монет каждые 24 часа.
/work_verify - вводить капчу и зарабатывать.
/voice_add_user - добавить пользователя в приватных войс.
/voice_delete_user - удалить пользователя с приватного войса.
/voice_add_zam - добавить совладельца для приватного канала.
/voice_delete_zam - удалить совладельца с приватного канала.
/voice_slot - ограничить канал по слотам 1000 монет.
/voice_live - купить безлимит для войс канала за 5000 монет.
/voice_open - открыть канал для всех
/voice_close - закрыть канал.
/voice_rename - изменить название своего канала
/voice_profile - открыть свой профиль войс каналов.
      `);

        await interaction.reply({ embeds: [embed] });
    },
};

