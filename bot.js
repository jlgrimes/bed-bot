require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const schedule = require('node-schedule');
const servRoles = require('./roles')
const storage = require('node-persist');

client.on('ready', () => {
    storage.init();

    // every day at midnight
    let job = schedule.scheduleJob('0 0 * * *', () => {
        console.log('The answer to life, the universe, and everything!');
    });
    console.log(`Logged in as ${client.user.tag}!`);
});
client.login(process.env.DISCORD_TOKEN);

const apiBase = 'http://api.hivemc.com/v1/';
const bwStatsUrl = (name) => apiBase + 'player/' + name + '/BED';

// data is what is returned from bw api
const winRate = (data) => data.victories / data.games_played;
const kd = (data) => data.kills / data.deaths;

const trimMention = (mention) => mention
    .replace('<@', '')
    .replace('>', '')
    .replace('!', '');

const addServRoles = (msg, mention, ign) => {
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
                kdRole = kdRole.values().next().value

                let servWrRole = servRoles.wr.filter(wrRole => wrRole.range(winRate(data)))
                let servWrRoleName = servWrRole[0].name

                let wrRole = roles.cache.filter(role => role.name === servWrRoleName)
                if (wrRole.size === 0) {
                    msg.reply('No roles named ' + name)
                    return;
                }
                wrRole = wrRole.values().next().value

                msg.guild.members.fetch(mention)
                    .then((member) => {
                        const allServRoleNames = [...servRoles.kd.map(role => role.name), ...servRoles.wr.map(role => role.name)];
                        const allServRoles = roles.cache.filter(role => allServRoleNames.includes(role.name))
                        member.roles.remove(allServRoles)
                            .then(() => {
                                member.roles.add([wrRole, kdRole])
                                    .catch((err) => console.log(err))
                                    .then(() => msg.reply('Roles ' + servWrRoleName + ' and ' + servKdRoleName + ' added for ' + member.user.username + '!'))
                            })         
                    })
            });
    })
}

client.on('message', msg => {
    let message = msg.content;
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ');
        let cmd = args[0];
        args = args.splice(1);

        if (cmd === 'set-ign') {
            if (msg.channel.name !== 'ign') {
                msg.reply('Must be in #ign to set-ign');
                return;
            }

            if (args.length !== 2) {
                msg.reply('Usage: !set-ign [mentioned user] [ign]');
                return;
            }

            storage.setItem(args[0], args[1])
                .then(() =>  msg.reply(args[0] + ', ' + args[1] + ' stored!'));
        }

        if (cmd === 'get-ign') {
            storage.getItem(args[0])
                .then(item => console.log(item));
        }

        if (cmd === 'remove-ign') {
            storage.removeItem(args[0])
                .then(() =>  msg.reply(args[0] + ' removed!'))
        }

        if (cmd === 'list-ign') {
            storage.forEach(async (datum) => {
                msg.reply(datum.key + ", " + datum.value)
            });
        }

        if (cmd === 'wipe-ign') {
            storage.clear().then(() => msg.reply('Database cleared!'))
        }

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

        if (cmd === 'stats-update-all') {
            storage.forEach(async (datum) => {
                let mention = trimMention(datum.key);
                let ign = datum.value;
                addServRoles(msg, mention, ign);
            });
        }

        if (cmd === 'stats-update') {
            if (args.length !== 2) {
                msg.reply('Usage: !stats-update [mentioned user] [ign]')
                return;
            }
            let mention = trimMention(args[0]);
            let ign = args[1];
            addServRoles(msg, mention, ign);
        }
     }
});
