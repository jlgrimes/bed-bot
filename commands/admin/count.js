const { Command } = require('discord.js-commando');
const countAllUsers = require('../../src/db/modules/countAllUsers')

module.exports = class CountCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'count',
			group: 'admin',
            memberName: 'count',
            description: 'Counts all users in the database.',
            userPermissions: ['ADMINISTRATOR'],
		});
	}

	run(message) {
        countAllUsers.run(message)
	}
};