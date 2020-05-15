const { Command } = require('discord.js-commando');
const fetch = require('node-fetch')
const api = require('../../api')
const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});

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
                    default: ''
				},
			],
		});
    }
    
    getStats(message, ign, selfCheck=false) {
        fetch(api.bwStatsUrl(ign))
            .then(response => response.json())
            .then(data => {
                let totalPoints = data.total_points
                let wr = (100 * data.victories / data.games_played).toFixed(3)
                let kd = (data.kills / data.deaths).toFixed(3)
                let bedsDestroyed = data.beds_destroyed
                let teamsEliminated = data.teams_eliminated
                let winStreak = data.win_streak
                

                const reply = '\n' +
                    'Stats for ' + ign + ':\n' +
                    'Total Points:\t**' + totalPoints + '**\n' +
                    'Win Rate:\t**' + wr + '%**\n' +
                    'KD:\t**' + kd + '**\n' +
                    'Beds Destroyed:\t**' + bedsDestroyed + '**\n' +
                    'Teams Eliminated:\t**' + teamsEliminated + '**\n' +
                    'Win Streak:\t**' + winStreak + '**'
                
                if (selfCheck) {
                    message.member.send(reply)
                }
                else {
                    message.reply(reply)
                }
            })
    }

	run(message, { ign }) {
        if (ign) {
            this.getStats(message, ign)
        }
        else {
            const fetchUserQuery = `
            SELECT * FROM users WHERE username='<@${message.member.id}>'
            `
    
            pool.connect()
                .then(client =>
                    client.query(fetchUserQuery)
                        .then(res => {
                            this.getStats(message, res.rows[0].ign, true)
                        })
                )
        }
	}
};