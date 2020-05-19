const { Command } = require('discord.js-commando');
const listAllUsers = require('../../src/db/modules/listAllUsers')

module.exports = class ListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'list',
			group: 'admin',
            memberName: 'list',
            description: 'Lists all users in the database.',
            userPermissions: ['ADMINISTRATOR'],
		});
	}

	run(message) {
        listAllUsers.run(message)
	}
};