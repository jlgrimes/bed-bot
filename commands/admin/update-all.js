const { Command } = require('discord.js-commando');
const storage = require('node-persist');
const update = require('./update')

const trimMention = (mention) => mention
    .replace('<@', '')
    .replace('>', '')
    .replace('!', '');

module.exports = class UpdateAllCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'update-all',
			group: 'admin',
            memberName: 'update-all',
            description: 'Updates all users\' roles with their in-game stats.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
			],
		});
    }

	run(message) {
        storage.forEach(async (datum) => {
            let mention = trimMention(datum.key);
            let ign = datum.value;

            const u = new update(this.client)
            u.addServRoles(mention, ign, message)
        });
	}
};