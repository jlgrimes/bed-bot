const { Command } = require('discord.js-commando');
const storage = require('node-persist');

module.exports = class DatabaseWipeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'db-wipe',
			group: 'admin',
			memberName: 'db-wipe',
            description: 'Wipes the database.',
            userPermissions: ['ADMINISTRATOR'],
            aliases: ['wipe', 'clear', 'db-clear'],
			args: [
			],
		});
	}

	run(message) {
        storage.clear().then(() => message.reply('Database cleared!'));
	}
};