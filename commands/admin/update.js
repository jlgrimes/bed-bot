const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const servRoles = require('../../roles')
const api = require('../../api')

const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});

// data is what is returned from bw api
const winRate = (data) => data.victories / data.games_played;
const kd = (data) => data.kills / data.deaths;

const log = (message, text) => message ? message.reply(text) : console.log(text);

const trimMention = (mention) => mention
    .replace('<@', '')
    .replace('>', '')
    .replace('!', '');

module.exports = class UpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'update',
			group: 'admin',
            memberName: 'update',
            description: 'Updates a users\' roles with their in-game stats.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
                {
					key: 'mentioned',
					prompt: 'Mention a user',
					type: 'user',
				}
			]
		});
    }

    addServRoles (mentionId, ign, message) {
        mentionId = trimMention(mentionId)
        const guild = message.guild

        fetch(api.bwStatsUrl(ign))
        .then((response) => response.json())
        .then(data => {
            guild.roles.fetch()
                .then(roles => {
                    let servKdRole = servRoles.kd.filter(kdRole => kdRole.range(kd(data)))
                    let servKdRoleName = servKdRole[0].name
    
                    let kdRole = roles.cache.filter(role => role.name === servKdRoleName)
                    if (kdRole.size === 0) {
                        log(message, 'No roles named ' + name)
                        return;
                    }
                    kdRole = kdRole.values().next().value
    
                    let servWrRole = servRoles.wr.filter(wrRole => wrRole.range(winRate(data)))
                    let servWrRoleName = servWrRole[0].name
    
                    let wrRole = roles.cache.filter(role => role.name === servWrRoleName)
                    if (wrRole.size === 0) {
                        log(message, 'No roles named ' + name)
                        return;
                    }
                    wrRole = wrRole.values().next().value
    
                    guild.members.fetch(mentionId)
                        .then((member) => {
                            const allServRoleNames = [...servRoles.kd.map(role => role.name), ...servRoles.wr.map(role => role.name)];
                            const allServRoles = roles.cache.filter(role => allServRoleNames.includes(role.name))
                            // console.log(allServRoles)
                            // console.log(member)
                            member.roles.remove(allServRoles)
                                .catch((err) => message.reply('remove: ' + err + '\ntry to removed:' + allServRoleNames.reduce((s, t) => s + t)))
                                .then(() => {
                                    member.roles.add([wrRole, kdRole])
                                        .catch((err) => message.reply(err))
                                        .then(() => log(message, 'Roles ' + servWrRoleName + ' and ' + servKdRoleName + ' added for ' + member.user.username + '!'))
                                })         
                        })
                });
        })
    }

	run(message, { mentioned }) {
        console.log(mentioned)
        let mention = mentioned.id

        const query = `
        SELECT username, ign FROM users WHERE username = '<@${mention}>';
        `
        
        pool.connect()
            .then(client => 
                client.query(query, (err, res) => {
                    if (err) throw err;
                    console.log(res)
                    const ign = res.rows[0].ign
                    this.addServRoles(mention, ign, message)
                  }
                )
            )
	}
};