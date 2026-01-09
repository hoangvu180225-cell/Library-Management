const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'library_db',
    multipleStatements: true // Quan trọng để chạy các script dài
});

module.exports = pool.promise();