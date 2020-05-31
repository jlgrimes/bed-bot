require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = {
    run: async (message, mentioned) => {
        const deleteUserQuery = `
		DELETE FROM users WHERE username='${mentioned}'
        `;
        
        const client = await pool.connect()
        try {
            await client.query(deleteUserQuery)
            message.author.send(`${mentioned} deleted!`)
        } catch (error) {
            console.log(error);
        }
    },
};
