require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const updateAll = require('../../commands/admin/update-all');

const client = new CommandoClient({
    commandPrefix: process.env.VERSION === 'dev' ? '?' : '!',
    owner: '265515383773986817',
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Administrator'],
        ['user', 'User'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, '../../commands'));

client.on('ready', () => {
    const u = new updateAll(client);
    u.run();

    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);
