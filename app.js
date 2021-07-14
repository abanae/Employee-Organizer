// SEtting Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');

// Setting Connection mySql
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employee_trackerDB',
  });
