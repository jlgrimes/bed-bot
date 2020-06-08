const { Command } = require('discord.js-commando');
const generateShitList = require('../../src/db/modules/generateShitList')

module.exports = class ShitListCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'shitlist',
			group: 'admin',
            memberName: 'shitlist',
            description: 'Makes a shitlist of everyone who has not run !set.',
			userPermissions: ['ADMINISTRATOR'],
			guildOnly: true,
		});
	}

	run(message) {
		if (message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
		}
		
        generateShitList.run(message)
	}
};