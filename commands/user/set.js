const { Command } = require('discord.js-commando');
const storage = require('node-persist');

const update = require('./update')

module.exports = class SetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'set',
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
            .then(() =>  {
				message.reply(
					'\n' +
					'Welcome to fuck it, bw server, ' + ign + '!\n' +
					'*Your in game name has been successfully registered.*'
				)

				const u = new update(client)
				u.addServRoles(message.member.id, ign, message)
			}
		);
	}
};