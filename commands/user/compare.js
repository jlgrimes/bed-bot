const { Command } = require('discord.js-commando');
const api = require('../../api')

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
					key: 'ign',
					prompt: 'Second in game name',
                    type: 'string'
                },
			],
		});
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

                let wr1 = (100 * data1.victories / data1.gamesPlayed).toFixed(3)
                let kd1 = (data1.kills / data1.deaths).toFixed(3)

                api.getStats(ign2)
                    .catch(err => console.log(err))
                    .then(data2 => {
                        if (!data2.firstLogin) {
                            message.reply('Player ' + ign2 + ' does not exist.')
                            return
                        }

                        let wr2 = (100 * data2.victories / data2.gamesPlayed).toFixed(3)
                        let kd2 = (data2.kills / data2.deaths).toFixed(3)

                        let reply = '\n```';
                        reply += `
                        Comparing ${ign1} and ${ign2}
                        `
                    })

                reply += 'tats for ' + ign + '\n' +
                    '\n' +
                    'Points:           ' + data.points + '\n' +
                    'Last Login:       ' + data.lastLogin.toLocaleString('en-US', { timeZoneName: 'short' }) + '\n' +
                    'Victories:        ' + data.victories + '\n' +
                    'Games Played:     ' + data.gamesPlayed + '\n' +
                    'Win Rate:         ' + wr + '%\n' +
                    'Kills:            ' + data.kills + '\n' +
                    'Deaths:           ' + data.deaths + '\n' +
                    'KD:               ' + kd + '\n' +
                    'Beds Destroyed:   ' + data.bedsDestroyed + '\n' +
                    'Teams Eliminated: ' + data.teamsEliminated + '\n' +
                    'Win Streak:       ' + data.winStreak + '\n'

                if (!mode) {
                    reply += 
                    'Title:            ' + data.title
                }

                reply += '```'
                
                message.reply(reply)
            })
    }

	run(message, { ign1, ign2 }) {
       this.compare(message, ign1, ign2)
	}
};