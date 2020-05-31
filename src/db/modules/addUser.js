require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = {
    run: async (message, mentioned, ign) => {
        const fetchUserQuery = `
		SELECT * FROM users WHERE username='${mentioned}'
        `;
        
        const client = await pool.connect()
        try {
            const res = await client.query(fetchUserQuery)
            if (res.rows.length > 0) {
                const row = res.rows[0];

                const updateUserQuery = `
                    UPDATE users
                    SET username = '${row.username}', ign = '${ign}'
                    WHERE username = '${row.username}'; 
                    `;

                await client.query(updateUserQuery);
                message.reply(`${mentioned} in game name updated to ${ign}!`);
                
            } else {
                const insertQuery = `
                    INSERT INTO users (username, ign)
                    VALUES ('${mentioned}', '${ign}');
                    `;

                    await client.query(insertQuery);
                    message.reply(`${mentioned} in game name updated to ${ign}!`);
            }
        } catch (error) {
            console.log(error);
        }
    },
};
