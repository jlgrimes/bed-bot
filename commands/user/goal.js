const { Command } = require('discord.js-commando');
const api = require('../../src/stats/api');
const { Pool } = require('pg');
const { modeEnum } = require('../../src/stats/helpers');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = class StatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'goal',
            group: 'user',
            memberName: 'goal',
            description: 'Tells you how many games you need to play to get your win rate/KD up.',
            args: [
                {
                    key: 'winRate',
                    prompt: 'Enter your target win rate',
                    type: 'string'
                },
                {
                    key: 'kd',
                    prompt: 'Enter your target KD',
                    type: 'string'
                },
            ],
        });
    }

    async getStats(message, ign) {
        // mode is just BED
        const mode = modeEnum();
        try {
            const data = await api.getStats(ign, mode);
            if (!data.firstLogin) {
                throw `Player ${ign} does not exist.`;
            }

            return data;
        } catch (error) {
            message.reply(`Beep boop, ${error}`);
            return null;
        }
    }

    async computeWinRate(message, data, winRate, kd) {
        const { kills, deaths, victories, gamesPlayed } = data;

        const targetKd = parseInt(kd);
        const targetWr = parseInt(winRate);

        
    }

    async run(message, { winRate, kd }) {
        const fetchUserQuery = `
        SELECT * FROM users WHERE username='<@${message.author.id}>'
        `;

        const client = await pool.connect();
        const res = await client.query(fetchUserQuery)
        const ign = res.rows[0].ign;

        const data = await this.getStats(message, ign);

        if (data === null) {
            return;
        }

        await this.computeWinRate(message, data, winRate, kd)
    }
};
