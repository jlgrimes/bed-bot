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

    run(message) {
        const query = `
        SELECT * FROM users;
        `;

        pool.connect().then((client) =>
            client.query(query, (err, res) => {
                if (err) throw err;

                console.log(res.rows);
                for (let row of res.rows) {
                    const u = new update(this.client);
                    u.addServRoles(row.username, row.ign, message);
                }
            })
        );
    }
};
