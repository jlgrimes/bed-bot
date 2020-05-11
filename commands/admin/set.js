const { Command } = require('discord.js-commando');
const storage = require('node-persist');

module.exports = class DatabaseSetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'db-set',
			group: 'admin',
            memberName: 'db-set',
            aliases: ['db-add', 'add'],
            description: 'Assigns a user to an in game name.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
                {
					key: 'mentioned',
					prompt: 'Mention a user',
					type: 'user',
				},
				{
					key: 'ign',
					prompt: 'Type in your in game name',
					type: 'string',
				},
			],
		});
	}

	run(message, { mentioned, ign }) {
        storage.setItem(mentioned.id, ign)
            .then(() =>  message.reply(mentioned.username + ' in game name set to ' + ign + '!'));
	}
};