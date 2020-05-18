const { Command } = require('discord.js-commando');
const api = require('../../helpers/api');
const { Pool } = require('pg');
const { lastLogin, wr, kd } = require('../../helpers/stats');
const { statsLine } = require('../../helpers/print');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

const gameModes = ['solo', 'solos', 'duo', 'duos', 'team', 'teams'];

module.exports = class StatsCommand extends Command {
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
                    default: '',
                },
                {
                    key: 'ign',
                    prompt: 'The in game name of the user',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    getReply(data, ign, mode) {
        const formattedData = [
            ['Points:', data.points],
            ['Last Login:', lastLogin(data)],
            ['Victories:', data.victories],
            ['Games Played:', data.gamesPlayed],
            ['Win Rate:', wr(data)],
            ['Kills:', data.kills],
            ['Deaths:', data.deaths],
            ['KD:', kd(data)],
            ['Beds Destroyed:', data.bedsDestroyed],
            ['Teams Eliminated:', data.teamsEliminated],
            ['Win Streak:', data.winStreak],
        ];

        if (!mode) {
            formattedData.push(['Title:', data.title]);
        }

        return `\`\`\`
${mode ? `${mode[0].toUpperCase()} ${mode.slice(1)} s` : `S`}tats for ${ign}

${formattedData.map((line) => statsLine(line[0], line[1])).join('\n')}
\`\`\``;
    }

    getStats(message, ign, mode) {
        api.getStats(ign, mode)
            .catch((err) => console.log(err))
            .then((data) => {
                // if the user never logged in, aka they're invalid
                if (!data.firstLogin) {
                    message.reply('Player ' + ign + ' does not exist.');
                    return;
                }

                const reply = this.getReply(data, ign, mode);

                message.reply(reply);
            });
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
            else if (gameModes.filter((gm) => gm === mode).length === 0) {
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
            `;

            pool.connect().then((client) =>
                client.query(fetchUserQuery).then((res) => {
                    this.getStats(message, res.rows[0].ign, mode);
                })
            );
        } else {
            this.getStats(message, ign, mode);
        }
    }
};
