var mysql = require("mysql2/promise");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "ramet_real",
  connectionLimit: 10,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0,
});

// connection.connect((err) => {
//   if (err) {
//     console.log("sql connection failed");
//   } else {
//     console.log("sql connected");
//   }
// });

module.exports = connection;
