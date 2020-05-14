require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
	  rejectUnauthorized: false
	}
});

module.exports = {
    run: (message) => {
        const query = `
        SELECT * FROM users;
        `
        
        pool.connect()
            .then(client => 
                client.query(query, (err, res) => {
                    if (err) throw err;

                    message.reply('There are ' + res.rows.length + ' homies')

                    client.end();
                  }
                )
            )
    }
}