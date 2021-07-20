// SEtting Dependencies
const util = require('util');
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
connection.connect((err) => {
    if (err) throw err;
    console.log(`Welcome to Employee Tracker ${connection.threadId}\n`);
    firstPrompt();
});

connection.query = util.promisify(connection.query);

const firstPrompt = async()=>{
    try {
        // Prompt Function
        const {userOptions} = await inquirer.prompt([
            {
                name: 'userOptions',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Employees By Roles',
                    'View all Employees By Deparments',
                    // 'View all Employees by Manager',
                    'Add Employee?',
                    'Add Role?',
                    'Add Department',
                    'Update Employee Roles',
                    // 'Update Employee Managers',
                    // 'Delete Employee',
                    // 'Delete Role',
                    // 'Delete Department',
                    // 'View Department Budgets'
                ],
            }
        ]);
        userSelection(userOptions);
    }catch (err){
        console.log(err);
    }
}

const userSelection = (userOptions)=>{
    switch (userOptions){
        case 'View All Employees':
            getAllEmpl();
            break;
        case 'View All Employees By Roles':
            getAllEmplRole();
            break;
        case 'View all Employees By Deparments':
            getAllDept();
            break;
        case 'Add Employees':
            addEmploye();
            break;    
    }
};

const getAllEmpl = async()=>{
    try{
    const employee = await connection.query('SELECT * FROM employee');
    console.table(employee);
    firstPrompt()
    }catch(err){
        console.log(err);
    }
};

const getAllEmplRole = async()=>{
    try{
    const role = await connection.query('SELECT * FROM role');
    console.table(role);
    firstPrompt()
    }catch(err){
        console.log(err);
    }
};

const getAllDept = async()=>{
    try{
    const dept = await connection.query('SELECT * FROM department');
    console.table(dept);
    firstPrompt()
    }catch(err){
    console.log(err);
    }
};
// Add Employees
const addEmployee = async ()=>{
    try{
        const role = await connection.query('SELECT * FROM role');

        const{ first_name, last_name, manager_id} = await inquirer.prompt([
        {
            name: 'first_name',
            message: "What is the employee's fist name?",
            type: 'input'
        },
        {
            name: 'last_name',
            message: "What is the employee's last name?",
            type: 'input'
        },
        {
            name: 'manager_id',
            message: "What is the employee's manager?",
            type: 'input'
        },

    ]);
    }catch(err) {
        connection.end();
    }
}
