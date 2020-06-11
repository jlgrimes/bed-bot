const { Command } = require('discord.js-commando');
const api = require('../../src/stats/api');
const { lastLogin, wr, kd } = require('../../src/stats/helpers');
const { compareLine } = require('../../src/stats/print');
const hive = require('hive-api');
const richEmbed = require('../../src/replies/compare')
module.exports = class CompareCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'compare',
            group: 'user',
            memberName: 'compare',
            description: 'Displays stats for a player.',
            args: [
                {
                    key: 'ign1',
                    prompt: 'First in game name',
                    type: 'string',
                },
                {
                    key: 'ign2',
                    prompt: 'Second in game name',
                    type: 'string',
                },
            ],
        });
    }

    async getReply(data1, data2, ign1, ign2) {
        return await richEmbed.generate(data1, data2, ign1, ign2);
        const formattedData = [
            ['Comparing', ign1, ign2],
            ['', '', ''],
            ['Points:', data1.points, data2.points],
            ['Victories:', data1.victories, data2.victories],
            ['Games Played:', data1.gamesPlayed, data2.gamesPlayed],
            ['Win Rate:', wr(data1), wr(data2)],
            ['Kills:', data1.kills, data2.kills],
            ['Deaths:', data1.deaths, data2.deaths],
            ['KD:', kd(data1), kd(data2)],
            ['Beds Destroyed:', data1.bedsDestroyed, data2.bedsDestroyed],
            ['Teams Eliminated:', data1.teamsEliminated, data2.teamsEliminated],
            ['Win Streak:', data1.winStreak, data2.winStreak],
            ['Title:', data1.title, data2.title],
        ];

        return `\`\`\`
${formattedData
    .map((line) => compareLine(line[0], line[1], line[2]))
    .join('\n')}
\`\`\``;
    }

    async compare(message, ign1, ign2) {
        try {
            const data1 = await api.getStats(ign1, hive.GameTypes.BED);
            if (!data1.firstLogin) {
                message.channel.send(`Player ${ign1} does not exist.`);
                return;
            }

           const data2 = await api.getStats(ign2, hive.GameTypes.BED)
           if (!data2.firstLogin) {
                message.channel.send(`Player ${ign2} does not exist.`);
                return;
            }

            const reply = await this.getReply(data1, data2, ign1, ign2);
            message.channel.send(reply);

        } catch (err) {
            console.log(err)
        }
    }

    async run(message, { ign1, ign2 }) {
        this.compare(message, ign1, ign2);
    }
};
