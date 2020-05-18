const { Command } = require('discord.js-commando');

const update = require('../admin/update');

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = class SetCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'refresh',
            group: 'user',
            memberName: 'refresh',
            description: 'Refreshes your stats.',
            guildOnly: true,
        });
    }

    run(message) {
        if (message.channel.type === 'dm') {
            message.reply('Must run this command in the server.');
            return;
        }
        const fetchUserQuery = `
		SELECT * FROM users WHERE username='<@${message.author.id}>'
		`;
        pool.connect().then((client) =>
            client.query(fetchUserQuery).then((res) => {
                const u = new update(this.client);
                u.addServRoles(message.author.id, res.rows[0].ign, message);
            })
        );
    }
};
