const { Command } = require('discord.js-commando');
const storage = require('node-persist');
const fetch = require('node-fetch');
const servRoles = require('../../roles')

const apiBase = 'http://api.hivemc.com/v1/';
const bwStatsUrl = (name) => apiBase + 'player/' + name + '/BED';

// data is what is returned from bw api
const winRate = (data) => data.victories / data.games_played;
const kd = (data) => data.kills / data.deaths;

const trimMention = (mention) => mention
    .replace('<@', '')
    .replace('>', '')
    .replace('!', '');

const log = (message, text) => message ? message.reply(text) : console.log(text);

module.exports = class RolesUpdateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'roles-update',
			group: 'admin',
            memberName: 'roles-update',
            aliases: ['update'],
            description: 'Updates all roles with users and igns in the database.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
			],
		});
    }

    addServRoles (mentionId, ign, message) {
        const guild = this.client.guilds.cache.first();

        fetch(bwStatsUrl(ign))
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
                            member.roles.remove(allServRoles)
                                .then(() => {
                                    member.roles.add([wrRole, kdRole])
                                        .catch((err) => console.log(err))
                                        .then(() => log(message, 'Roles ' + servWrRoleName + ' and ' + servKdRoleName + ' added for ' + member.user.username + '!'))
                                })         
                        })
                });
        })
    }

	run(message) {
        storage.forEach(async (datum) => {
            let mention = trimMention(datum.key);
            let ign = datum.value;
            this.addServRoles(mention, ign, message);
        });
	}
};