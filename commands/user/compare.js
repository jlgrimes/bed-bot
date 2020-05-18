const { Command } = require('discord.js-commando');
const api = require('../../api')
const { lastLogin, wr, kd } = require('../../helpers/stats')

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
                    type: 'string'
				},
                {
					key: 'ign2',
					prompt: 'Second in game name',
                    type: 'string'
                },
			],
		});
    }

    getReply(data1, data2, ign1, ign2) {
        const comp = (val1, val2) => `${val1 > val2 ? `>` : val1 < val2 ? `<` : `=`}`
        const printLine = (val1, val2) => `${val1}\t${comp(val1, val2)}\t${val2}`

        return (
`\`\`\`
Comparing ${ign1} against ${ign2}

Points:            ${printLine(data1.points, data2.points)}
Victories:         ${printLine(data1.victories, data2.victories)}
Games Played:      ${printLine(data1.gamesPlayed, data2.gamesPlayed)}
Win Rate:          ${printLine(wr(data1), wr(data2))}
Kills:             ${printLine(data1.kills, data2.kills)}
Deaths:            ${printLine(data1.deaths, data2.deaths)}
KD:                ${printLine(kd(data1), kd(data2))}
Beds Destroyed:    ${printLine(data1.bedsDestroyed, data2.bedsDestroyed)}
Teams Eliminated:  ${printLine(data1.teamsEliminated, data2.teamsEliminated)}
Win Streak:        ${printLine(data1.winStreak, data2.winStreak)}
Title:             ${data1.title} vs ${data2.title}
\`\`\``
        )
    }
    
    compare(message, ign1, ign2) {
        api.getStats(ign1)
            .catch(err => console.log(err))
            .then(data1 => {
                // if the user never logged in, aka they're invalid
                if (!data1.firstLogin) {
                    message.reply('Player ' + ign1 + ' does not exist.')
                    return
                }

                api.getStats(ign2)
                    .catch(err => console.log(err))
                    .then(data2 => {
                        if (!data2.firstLogin) {
                            message.reply('Player ' + ign2 + ' does not exist.')
                            return
                        }

                        const reply = this.getReply(data1, data2, ign1, ign2)
                        message.reply(reply)
                    })
            })
    }

	run(message, { ign1, ign2 }) {
       this.compare(message, ign1, ign2)
	}
};