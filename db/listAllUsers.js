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

                    let reply = ''
                    console.log(res.rows)
                    for (let row of res.rows) {
                        reply += row.username + ' ' + row.ign + '\n'
                    }
                    message.reply(reply)

                    client.end();
                  }
                )
            )
    }
}