const { Command } = require('discord.js-commando');
const storage = require('node-persist');

module.exports = class DatabaseListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'db-list',
			group: 'admin',
            memberName: 'db-list',
            aliases: ['list'],
            description: 'Lists all users in the database.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
			],
		});
	}

	run(message) {
        storage.forEach(async (datum) => {
            message.reply(datum.key + ", " + datum.value)
        });
	}
};