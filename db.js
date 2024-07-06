const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'vinsen',
    password: 'dbs5h0CBlNt37Vx3',
    database: 'restaurant'
});

conn.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

module.exports = conn;
