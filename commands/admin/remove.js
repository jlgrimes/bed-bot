require('dotenv').config();

const { Command } = require('discord.js-commando');
const removeUser = require('../../src/db/modules/removeUser');

module.exports = class RemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            group: 'admin',
            memberName: 'remove',
            description: 'Removes a user from the database.',
            userPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
            args: [
                {
                    key: 'mentioned',
                    prompt: 'Mention a user',
                    type: 'user',
                }
            ],
        });
    }

    run(message, { mentioned }) {
        if (message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
        }
        
        removeUser.run(message, mentioned);
    }
};
