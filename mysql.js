//连接数据库，并返回闭包
var mysql = require('mysql2');

var pool = mysql.createPool({
    host: '',
    port: '',
    user: '',
    password: '',
    database: 'visa'
});

function getSql() {
    return function () {
        return pool;
    }
}

module.exports = {
    getSql: getSql
}