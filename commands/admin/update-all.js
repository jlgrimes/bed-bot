const { Command } = require('discord.js-commando');
const update = require('./update');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = class UpdateAllCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update-all',
            group: 'admin',
            memberName: 'update-all',
            description: "Updates all users' roles with their in-game stats.",
            userPermissions: ['ADMINISTRATOR'],
            throttling: {
                usages: 1,
                duration: 60,
            },
            guildOnly: true,
        });
    }

    async run(message) {
        if (message.channel.guild && message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
            return;
        }

        const query = `
        SELECT * FROM users;
        `;

        const client = await pool.connect();
        try {
            const res = await client.query(query);
            for (let row of res.rows) {
                const u = new update(this.client);
                await u.addServRoles(row.username, row.ign, message);
            }
        } finally {
            client.release();
        }
    }
};
