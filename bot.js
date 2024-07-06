const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const userVoiceTimes = {};
global.lastTimelyUsage = {};
global.userBalances = {};
global.userCases = {};

// Load command files
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.error(`The command in file ${file} is missing a required "data" or "data.name" property.`);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if (interaction.isSelectMenu()) {
        const command = client.commands.get('n');

        if (command && command.handleSelectMenu) {
            try {
                await command.handleSelectMenu(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while handling this interaction!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Невалидное взаимодействие.', ephemeral: true });
        }
    } else if (interaction.isModalSubmit()) {
        const command = client.commands.get('n');

        if (command && command.handleModalSubmit) {
            try {
                await command.handleModalSubmit(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while handling this interaction!', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Невалидное взаимодействие.', ephemeral: true });
        }
    }
});

client.on('guildMemberAdd', async member => {
    try {
        const roleId = config.defaultRoleId;
        const role = member.guild.roles.cache.get(roleId);
        if (role) {
            await member.roles.add(roleId);
            console.log(`Role ${roleId} added to ${member.user.tag}`);
        } else {
            console.error(`Role ID ${roleId} does not exist in this guild.`);
        }
    } catch (error) {
        console.error(`Error adding role: ${error}`);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const userId = newState.id;

    if (!oldState.channelId && newState.channelId) {
        userVoiceTimes[userId] = Date.now();
    }

    if (oldState.channelId && !newState.channelId) {
        const startTime = userVoiceTimes[userId];
        const endTime = Date.now();
        const sessionDuration = endTime - startTime;

        const sessionDurationInMinutes = Math.floor(sessionDuration / (1000 * 60));
        const earnedCoins = Math.floor(sessionDurationInMinutes / 2);

        if (!global.userBalances[userId]) {
            global.userBalances[userId] = 0;
        }
        global.userBalances[userId] += earnedCoins;

        console.log(`User ${userId} earned ${earnedCoins} coins for being in voice channel for ${sessionDurationInMinutes} minutes.`);

        delete userVoiceTimes[userId];
    }
});

client.login(config.token);
