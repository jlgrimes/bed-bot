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
CREATE TABLE users (
  username varchar(255),
  ign varchar(255)
);
`

client.query(query, (err, res) => {
  if (err) throw err;
  console.log(res)
  client.end();
});
