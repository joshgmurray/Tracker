const mysql = require('mysql2');
require('dotenv').config()

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'catalina',
  database: 'employee_tracker'
});

connection.connect((err) => {
    if(err) {
        console.log('db connect err ===', err);
    }
    console.log('database connection ok ===');
    setTimeout(() => {
        console.log('welcome to my Employee Tracker program!');
    }, 1000);
    
});

