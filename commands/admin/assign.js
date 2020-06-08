require('dotenv').config();

const { Command } = require('discord.js-commando');
const addUser = require('../../src/db/modules/addUser');

module.exports = class AssignCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'assign',
            group: 'admin',
            memberName: 'assign',
            description: 'Assigns a user to an in game name.',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'mentioned',
                    prompt: 'Mention a user',
                    type: 'user',
                },
                {
                    key: 'ign',
                    prompt: 'Type in your in game name',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { mentioned, ign }) {
        if (message.channel.guild && message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
        }
        
        addUser.run(message, mentioned, ign);
    }
};
