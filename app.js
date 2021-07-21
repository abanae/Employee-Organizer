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

const firstPrompt = async () => {
    try {
        // Prompt Function
        const { userOptions } = await inquirer.prompt([
            {
                name: 'userOptions',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'View All Employees By Roles',
                    'View all Employees By Deparments',
                    // 'View all Employees by Manager',
                    'Add Employee',
                    'Add Role',
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
    } catch (err) {
        console.log(err);
    }
}

// Switch Case (User Options)
const userSelection = (userOptions) => {
    switch (userOptions) {
        case 'View All Employees':
            getAllEmpl();
            break;
        case 'View All Employees By Roles':
            getAllEmplRole();
            break;
        case 'View all Employees By Deparments':
            getAllDept();
            break;
        case 'Add Employee':
            addEmpl();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Update Employees':
            updateEmpl();
            break;
    }
};

const getAllEmpl = async () => {
    try {
        const employee = await connection.query('SELECT * FROM employee');
        console.table(employee);
        firstPrompt()
    } catch (err) {
        console.log(err);
    }
};

const getAllEmplRole = async () => {
    try {
        const role = await connection.query('SELECT * FROM role');
        console.table(role);
        firstPrompt()
    } catch (err) {
        console.log(err);
    }
};

const getAllDept = async () => {
    try {
        const dept = await connection.query('SELECT * FROM department');
        console.table(dept);
        firstPrompt()
    } catch (err) {
        console.log(err);
    }
};
// Add Employees
const addEmpl =  () => {
    connection.query('SELECT title, id FROM role', async (err, positions) => {
        if (err) throw err;
    try {
        const answer = await inquirer.prompt([
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
                name: 'role_id',
                message: "What is the employee's role?",
                type: 'list',
                choices: positions.map(title => ({ name: title.title, value: title.id }))
        }
        ]); 
        const query = 'INSERT INTO employee (first_name, last_name, role_id) VALUES(?, ?, ?)';
        connection.query(query, [first_name, last_name, role_id], (err, result) => {
            if (err) throw err;
            console.log('Employee added!', result);
        });
    } catch (err) {
        console.log(err);
        connection.end()
    }
});
}


// const addRole = async() => {
//   connection.query
// }

// const addDepartment = async() => {
//   connection.query
// }

// const updateEmpl = async() => {
//   connection.query
// }

// connection.end();