const { Command } = require('discord.js-commando');
const storage = require('node-persist');

module.exports = class DatabaseWipeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'wipe',
			group: 'admin',
			memberName: 'wipe',
            description: 'Wipes the database.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
			],
		});
	}

	run(message) {
		message.reply('nono... dont use this')
        // storage.clear().then(() => message.reply('Database cleared!'));
	}
};