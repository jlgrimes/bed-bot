const { Command } = require('discord.js-commando');

const update = require('../admin/update');

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = class RefreshCommand extends Command {
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
        if (message.channel.guild.id !== process.env.SERVER_ID) {
            message.reply(`Must be on Holli's server to run`);
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
