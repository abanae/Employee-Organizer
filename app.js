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

//   Connection DB
connection.connect(async (err) => {
    if (err) throw err;
    console.log(`Welcome to Employee Tracker ${connection.threadId}\n`);
    try {
        // Prompt Function
        const userChoice1 = await inquirer.prompt([
            {
                name: 'userOptions',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Employees By Roles',
                    'View all Employees By Deparments',
                    'View all Employees by Manager',
                    'Add Employee?',
                    'Add Role?',
                    'Add Department',
                    'Update Employee Roles',
                    'Update Employee Managers',
                    'Delete Employee',
                    'Delete Role',
                    'Delete Department',
                    'View Department Budgets'
                ],
            }
        ]);
        userSelection(userChoice1.userOptions);
    }catch (e){
        console.log(e);
    }

});