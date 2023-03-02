const mysql = require('mysql');

// connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

// view users
exports.view = (req, res) => {
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as id #' + connection.threadId);

        // use the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                res.render('home', { rows });
            } else {
                console.log(err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}

exports.find = (req, res) => {
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as id #' + connection.threadId);

        let searchTerm = req.body.search;

        // use the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ?', ['%'+ searchTerm +'%'], (err, rows) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                res.render('home', { rows });
            } else {
                console.log(err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}