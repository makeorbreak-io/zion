//var mysql = require('mysql-wrapper');
/*var conn = mysql({
    host: "localhost",
    database: "zion",
    user: "root",
    password: "minda_171",
    port: 3306
});*/
/*var conn = mysql({
    host: "localhost",
    database: "zion",
    user: "zion",
    password: "minda_171"
});

conn.query('SELECT * FROM users {{where data}}', {
    data: {
        userId: 1
    }
}, function(err, result) {
    console.log(err, result);
});*/

var mysql = require('mysql');

var dbcon = mysql.createConnection({
    host: "localhost",
    database: "zion",
    user: "zion",
    password: "minda_171" //, port: 3306
});

dbcon.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports.dbcon = dbcon;

module.exports.query = function(query, data, callback) {
    dbcon.query(query, data, callback);
};

/*dbcon.query("SELECT * FROM users", function(err, result, fields) {
    if (err) throw err;
    console.log(result);
});*/