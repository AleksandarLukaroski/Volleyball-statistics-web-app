// config/database.js
const mysql = require("mysql");

//Configure Database
connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "volleyball master",
});

//Connect to Database
connection.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("MySQL Connected...");
});

module.exports = connection;
