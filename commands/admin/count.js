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
		if (message.channel.guild && message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
		}
		
        countAllUsers.run(message)
	}
};