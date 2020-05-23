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
		});
	}

	run(message) {
        generateShitList.run(message)
	}
};