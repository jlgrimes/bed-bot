require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = {
    run: (message, mentioned, ign) => {
        const fetchUserQuery = `
		SELECT * FROM users WHERE username='${mentioned}'
		`;

        pool.connect().then((client) =>
            client
                .query(fetchUserQuery)
                .then((res) => {
                    if (res.rows.length > 0) {
                        const row = res.rows[0];

                        const updateUserQuery = `
							UPDATE users
							SET username = '${row.username}', ign = '${ign}'
							WHERE username = '${row.username}'; 
							`;
                        pool.connect().then((client) =>
                            client
                                .query(updateUserQuery)
                                .then((res) => {
                                    console.log(res);
                                    message.reply(
                                        mentioned +
                                            ' in game name updated to ' +
                                            ign +
                                            '!'
                                    );
                                })
                                .catch((err) => console.log(err))
                        );
                    } else {
                        const insertQuery = `
							INSERT INTO users (username, ign)
							VALUES ('${mentioned}', '${ign}');
							`;

                        client.query(insertQuery, (err, res) => {
                            if (err) throw err;
                            message.reply(
                                mentioned + ' in game name set to ' + ign + '!'
                            );
                            client.end();
                        });
                    }
                })
                .catch((err) => console.log(err))
        );
    },
};
