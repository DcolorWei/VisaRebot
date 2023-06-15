'use strict';

var mysql = require('mysql2');
var connection;

exports.initialize = (context, callback) => {
    console.log('initializing');
    connection = mysql.createConnection({
        host: process.env.MYSQL_ENDPOINT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DBNAME
    });
    connection.connect((err) => {
        callback(null, 'succ');

    });

};

exports.handler = function (request, response, context) {
    const sql = `select * from visa`;
    connection.query(sql, function (err, result) {
        response.setStatusCode(200)
        response.setHeader('content-type', 'text/plain')
        response.send('succ')
        response.send(result);
    });

}

exports.pre_stop = (context, callback) => {
    console.log('pre_stop start');
    connection.end();
    console.log('pre_stop end');
    callback(null, '');
}