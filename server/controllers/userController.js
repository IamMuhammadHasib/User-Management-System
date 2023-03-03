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
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
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

// Render new user page
exports.form = (req, res) => {
    res.render('add-user');
}

// Add a new user
exports.create = (req, res) => {
    // res.render('add-user');


    const{first_name, last_name, email, phone, comments} = req.body;

    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as id #' + connection.threadId);

        let searchTerm = req.body.search;

        // use the connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?',
        [first_name, last_name, email, phone, comments], (err, rows) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                res.render('add-user', { alert: 'User added successfully.' });
            } else {
                console.log(err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}


// Edit a user
exports.edit = (req, res) => {
    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as id #' + connection.threadId);

        // use the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                res.render('edit-user', { rows });
            } else {
                console.log(err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}

// Update user
exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    // connect to DB
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as id #' + connection.threadId);

        // use the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                // connect to DB
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('Connected as id #' + connection.threadId);

                    // use the connection
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
                        // when done with the connection, release it
                        connection.release();

                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updated.` });
                        } else {
                            console.log(err);
                        }

                        console.log('The data from user table: \n', rows);
                    });
                });
            } else {
                console.log(err);
            }

            console.log('The data from user table: \n', rows);
        });
    });
}