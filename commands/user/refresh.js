const { Command } = require('discord.js-commando');

const update = require('../admin/update')

const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});

module.exports = class SetCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'refresh',
			group: 'user',
			memberName: 'refresh',
			description: 'Refreshes your stats.',
			args: [
			],
		});
	}

	run(message) {
        const fetchUserQuery = `
		SELECT * FROM users WHERE username='<@${message.member.id}>'
		`
        pool.connect()
            .then(client =>
                client.query(fetchUserQuery)
                    .then(res => {
                        const u = new update(this.client)
                        console.log(message.member.id)
                        u.addServRoles(message.member.id, res.rows[0].ign, message)
                    })
            )
	}
};