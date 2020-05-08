require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

const apiBase = 'http://api.hivemc.com/v1/';
const bwStatsUrl = (name) => apiBase + 'player/' + name + '/BED'

client.on('message', msg => {
    let message = msg.content;
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ');
        let cmd = args[0];
        args = args.splice(1);

        if (cmd === 'stats') {
            let name = args[0];
            fetch(bwStatsUrl(name))
                .then(response => response.json())
                .then(data => {
                    const winRate = Number.parseFloat(data.victories / data.games_played * 100).toFixed(2);
                    const kd = Number.parseFloat(data.kills / data.deaths).toFixed(2);

                    const reply = 'Win rate: ' + winRate + '\n'
                                + 'KD: ' + kd;
                    msg.reply(reply)
                })
        }
     }
});
