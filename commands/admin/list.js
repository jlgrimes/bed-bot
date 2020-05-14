const { Command } = require('discord.js-commando');
const listAllUsers = require('../../db/listAllUsers')

module.exports = class DatabaseListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list',
			group: 'admin',
            memberName: 'list',
            description: 'Lists all users in the database.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
			],
		});
	}

	run(message) {
        listAllUsers.run(message)
	}
};