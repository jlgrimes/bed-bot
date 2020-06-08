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
			guildOnly: true,
		});
	}

	run(message) {
		if (message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
		}
		
        listAllUsers.run(message)
	}
};