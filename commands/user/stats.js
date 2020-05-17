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
        api.getStats(ign)
            .then(data => {
                let wr = (100 * data.victories / data.gamesPlayed).toFixed(3)
                let kd = (data.kills / data.deaths).toFixed(3)

                const reply = '\n' +
                    'Stats for ' + ign + ':\n' +
                    'Points:\t**' + data.points + '**\n' +
                    'Last Login:\t**' + data.lastLogin.toLocaleString('en-US', { timeZoneName: 'short' }) + '**\n' +
                    'Victories:\t**' + data.victories + '**\n' +
                    'Games Played:\t**' + data.gamesPlayed + '**\n' +
                    'Win Rate:\t**' + wr + '%**\n' +
                    'Kills:\t**' + data.kills + '**\n' +
                    'Deaths:\t**' + data.deaths + '**\n' +
                    'KD:\t**' + kd + '**\n' +
                    'Beds Destroyed:\t**' + data.bedsDestroyed + '**\n' +
                    'Teams Eliminated:\t**' + data.teamsEliminated + '**\n' +
                    'Win Streak:\t**' + data.winStreak + '**\n' +
                    'Title:\t**' + data.title + '**'
                
                message.reply(reply)
            })
    }

	run(message, { ign }) {
        if (ign) {
            this.getStats(message, ign)
        }
        else {
            const fetchUserQuery = `
            SELECT * FROM users WHERE username='<@${message.author.id}>'
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