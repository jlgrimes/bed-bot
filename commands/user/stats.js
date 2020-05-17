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
            .catch(err => console.log(err))
            .then(data => {
                // if the user never logged in, aka they're invalid
                if (!data.firstLogin) {
                    message.reply('Player ' + ign + ' does not exist.')
                    return
                }
                let wr = (100 * data.victories / data.gamesPlayed).toFixed(3)
                let kd = (data.kills / data.deaths).toFixed(3)

                let reply = '\n```';

                if (mode) {
                    reply += mode[0].toUpperCase() + mode.slice(1) + ' s'
                }
                else {
                    reply += 'S'
                }

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

	run(message, { mode, ign }) {
        let selfCheck = false;

        // if ign is not provided (there is only 1 argument)
        if (!ign) {
            // if no arguments are provided
            if (!mode) {
                selfCheck = true;
            }
            // if only argument provided is actually ign and not mode
            else if (gameModes.filter(gm => gm === mode).length === 0) {
                ign = mode;
                mode = null;
            }
            // if the only argument provided actually is a mode
            else {
                selfCheck = true;
            }
        }


        if (selfCheck) {
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
        else {
            this.getStats(message, ign, mode)
        }
	}
};