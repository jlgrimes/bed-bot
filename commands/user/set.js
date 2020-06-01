const { Command } = require('discord.js-commando');

const update = require('../admin/update');
const addUser = require('../../src/db/modules/addUser');

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
            guildOnly: true,
        });
    }

    run(message, { ign }) {
        if (message.channel.guild && message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
        }
        
        addUser.run(message, `<@${message.author.id}>`, ign);
        message.reply(`
Welcome to fuck it bw server, ${ign}!
*Your in game name has been successfully registered.*
		`);

        const u = new update(this.client);
        u.addServRoles(message.author.id, ign, message);
    }
};
