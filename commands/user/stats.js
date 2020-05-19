const { Command } = require('discord.js-commando');
const api = require('../../src/stats/api');
const { Pool } = require('pg');
const richEmbed = require('../../src/stats/richEmbed')
const { modeEnum } = require('../../src/stats/helpers')

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
        return richEmbed.generate(data, ign, mode);
    }

    async getStats(message, ign, mode) {
        try {
            const data = await api.getStats(ign, mode);
            if (!data.firstLogin) {
                message.reply(`Player ${ign} does not exist.`);
                return;
            }

            const reply = await this.getReply(data, ign, mode);

            message.reply(reply);
        } catch (error) {
            console.log(error);
        }
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

        mode = modeEnum(mode)

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
