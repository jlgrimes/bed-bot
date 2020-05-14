require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const query = `
DELETE FROM users;
`

client.query(query, (err, res) => {
  if (err) throw err;
  console.log(res)
  client.end();
});
