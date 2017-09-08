var mysql = require('mysql');

var dbcon = mysql.createConnection({
    host: "localhost",
    database: "zion",
    user: "root",
    password: "novapass_4",
    port: 3306
});

dbcon.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports.dbcon = dbcon;

module.exports.query = function(query, data, callback) {
    dbcon.query(query, data, callback);
};