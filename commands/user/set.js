const { Command } = require('discord.js-commando');
const storage = require('node-persist');

module.exports = class SetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set',
			aliases: ['set-ign', 'ign'],
			group: 'user',
			memberName: 'set',
			description: 'Assigns yourself an in game name.',
			examples: ['demathderp'],
			args: [
				{
					key: 'ign',
					prompt: 'Type in your in game name',
					type: 'string',
				},
			],
		});
	}

	run(message, { ign }) {
        if (message.channel.name !== 'ign') {
            message.reply('Must be in #ign to run');
            return;
        }

        console.log(message.member)

        storage.setItem(message.member.id, ign)
            .then(() =>  message.reply('In game name set to ' + ign + '!'));
	}
};