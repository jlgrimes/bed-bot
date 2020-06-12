const { Command } = require('discord.js-commando');

module.exports = class UnknownCommandCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unknown-command',
            group: 'util',
            memberName: 'unknown-command',
            description:
                'Displays help information for when an unknown command is used.',
            examples: ['unknown-command kickeverybodyever'],
            unknown: true,
            hidden: true,
        });
    }

    run(msg) {
        if (msg.author.id === '483421168234266625') {
            return msg.reply('stfu lexi');
        }
        if (msg.author.id === '494548750929494017') {
            return msg.reply('Unknown command. ur such a great person don\'t think anything different about yourself :)')
        }
        return msg.reply(
            `Unknown command. Use ${msg.anyUsage(
                'help',
                msg.guild ? undefined : null,
                msg.guild ? undefined : null
            )} to view the command list.`
        );
    }
};
