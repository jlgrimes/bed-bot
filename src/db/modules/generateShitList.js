require('dotenv').config();

const { Pool } = require('pg');
const richEmbed = require('../../replies/shitlist')

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = {
    run: (message) => {
        const query = `
        SELECT * FROM users;
        `;

        pool.connect().then((client) =>
            client.query(query, (err, res) => {
                if (err) throw err;

                let shitlist = []
                for (let [id, _] of message.channel.guild.members.cache) {
                    const mention = `<@${id}>`
                    const filteredTable = res.rows.filter(row => row.username === mention)
                    if (filteredTable.length === 0) {
                        shitlist.push(mention)
                    }
                }

                const reply = richEmbed.generate(shitlist)

                message.channel.send(reply);

                client.end();
            })
        );
    },
};
