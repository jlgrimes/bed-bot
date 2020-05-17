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

const gameModes = ['solo', 'solos', 'duo', 'duos', 'team', 'teams']

module.exports = class DatabaseWipeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stats',
			group: 'user',
			memberName: 'stats',
            description: 'Displays stats for a player.',
			args: [
                {
					key: 'mode',
					prompt: 'Game mode of bed wars (solo, duo, teams)',
                    type: 'string',
                    default: ''
				},
                {
					key: 'ign',
					prompt: 'The in game name of the user',
                    type: 'string',
                    default: ''
                },
			],
		});
    }
    
    getStats(message, ign, mode) {
        api.getStats(ign, mode)
            .then(data => {
                // if the user never logged in, aka they're invalid
                if (!data.firstLogin) {
                    message.reply('Player ' + ign + ' does not exist.')
                    return
                }
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

	run(message, { mode, ign }) {
        let selfCheck = false;

        if (!ign) {
            // if only argument provided is actually ign and not mode
            if (gameModes.filter(gm => gm === mode).length === 0) {
                ign = mode;
                mode = null;
            }
            else {
                selfCheck = true;
            }
        }


        if (selfCheck) {
            this.getStats(message, ign, mode)
        }
        else {
            const fetchUserQuery = `
            SELECT * FROM users WHERE username='<@${message.author.id}>'
            `
    
            pool.connect()
                .then(client =>
                    client.query(fetchUserQuery)
                        .then(res => {
                            this.getStats(message, res.rows[0].ign, mode)
                        })
                )
        }
	}
};