const mysql2 = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
  connectionLimit: 10,
  //   socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
});


// module.exports = dbConnection;
module.exports = dbConnection.promise();
