require('dotenv').config();

const schedule = require('node-schedule');
const storage = require('node-persist');

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const update = require('./commands/admin/update')

const client = new CommandoClient({
    commandPrefix: '!',
    owner: '265515383773986817'
})

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Admin'],
        ['user', 'User']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    storage.init();

    // every day at midnight
    let job = schedule.scheduleJob('0 0 * * *', () => {
        const u = new update(client)
        u.run()
    });

    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
    //...
});