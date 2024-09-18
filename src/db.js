const sqlite3 = require('sqlite3');
require('dotenv').config();

const connection = new sqlite3.Database('OnviSupport.db',(err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
})

module.exports = connection;