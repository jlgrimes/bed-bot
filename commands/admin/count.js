const { Command } = require('discord.js-commando');
const countAllUsers = require('../../db/modules/countAllUsers')

module.exports = class DatabaseCountCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'count',
			group: 'admin',
            memberName: 'count',
            description: 'Counts all users in the database.',
            userPermissions: ['ADMINISTRATOR'],
			args: [
			],
		});
	}

	run(message) {
        countAllUsers.run(message)
	}
};