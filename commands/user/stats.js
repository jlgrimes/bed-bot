const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const api = require('../../api')

module.exports = class DatabaseWipeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			group: 'user',
			memberName: 'stats',
            description: 'Displays stats for a player.',
			args: [
                {
					key: 'ign',
					prompt: 'The in game name of the user',
					type: 'string',
				},
			],
		});
	}

	run(message, { ign }) {
        fetch(api.bwStatsUrl(ign))
            .then(response => response.json())
            .then(data => {
                let totalPoints = data.total_points
                let wr = (100 * data.victories / data.games_played).toFixed(3)
                let kd = (data.kills / data.deaths).toFixed(3)
                let bedsDestroyed = data.beds_destroyed
                let teamsEliminated = data.teams_eliminated
                let winStreak = data.win_streak
                
                message.reply(
                    '\n' +
                    'Stats for ' + ign + ':\n' +
                    'Total Points:\t' + totalPoints + '\n' +
                    'Win Rate:\t' + wr + '%\n' +
                    'KD:\t' + kd + '\n' +
                    'Beds Destroyed:\t' + bedsDestroyed + '\n' +
                    'Teams Eliminated:\t' + teamsEliminated + '\n' +
                    'Win Streak:\t' + winStreak
                )
            })
	}
};