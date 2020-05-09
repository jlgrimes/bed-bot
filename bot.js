require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const servRoles = require('./roles')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

const apiBase = 'http://api.hivemc.com/v1/';
const bwStatsUrl = (name) => apiBase + 'player/' + name + '/BED';

// data is what is returned from bw api
const winRate = (data) => data.victories / data.games_played;
const kd = (data) => data.kills / data.deaths;

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

                    const reply = 'Win rate: ' + winRate(data) + '\n'
                                + 'KD: ' + kd(data);
                    msg.reply(reply)
                })
        }

        if (cmd === 'addrole') {
            let name = args.join(' ');
            msg.guild.roles.fetch()
                .then(roles => {
                    let role = roles.cache.filter(role => role.name === name)

                    if (role.size === 0) {
                        msg.reply('No roles named ' + name)
                    }

                    // msg.member is the member who sent the function
                    let member = msg.member;

                    member.roles.add(role)
                        .catch((err) => msg.reply(err))
                        .then(() => msg.reply('Role added!'));
                });
            //member.addRole(role).catch(console.error);
        }

        if (cmd === 'stats-update') {
            if (args.length !== 2) {
                msg.reply('Usage: !stats-update [mentioned user] [ign]')
                return;
            }
            let mention = args[0]
                .replace('<@', '')
                .replace('>', '')
                .replace('!', '');
            let ign = args[1];

            fetch(bwStatsUrl(ign))
                .then((response) => response.json())
                .then(data => {
                    msg.guild.roles.fetch()
                        .then(roles => {
                            let servKdRole = servRoles.kd.filter(kdRole => kdRole.range(kd(data)))
                            let servKdRoleName = servKdRole[0].name

                            let kdRole = roles.cache.filter(role => role.name === servKdRoleName)
                            if (kdRole.size === 0) {
                                msg.reply('No roles named ' + name)
                                return;
                            }

                            let servWrRole = servRoles.wr.filter(wrRole => wrRole.range(winRate(data)))
                            let servWrRoleName = servWrRole[0].name

                            let wrRole = roles.cache.filter(role => role.name === servWrRoleName)
                            if (wrRole.size === 0) {
                                msg.reply('No roles named ' + name)
                                return;
                            }
        
                            msg.guild.members.fetch(mention)
                                .then((member) => {
                                    member.roles.add(wrRole, kdRole)
                                        .catch((err) => msg.reply(err))
                                        .then(() => msg.reply('Roles added!'));
                                })
                        });
                })
        }
     }
});
