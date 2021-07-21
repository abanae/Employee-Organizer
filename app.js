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
                    'Delete Employee',
                    // 'Delete Role',
                    // 'Delete Department',
                    // 'View Department Budgets',
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
        case 'Delete Employee':
            deleteEmpl();
            break
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
const addEmpl = () => {
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
            connection.query(query, [answer.first_name, answer.last_name, answer.role_id], (err, result) => {
                if (err) throw err;
                console.log('Employee added!', result);
                connection.end();
            });
        } catch (err) {
            console.log(err);
            connection.end();
        }
    });
}

// Add Role
const addRole = async () => {
    try {
        const { title, salary, departmentId } = await inquirer.prompt([
        {
            name: 'title',
            message: 'What is the title of new role?',
            type: 'input'
        },
        {
            name: 'salary',
            message: "What is the new role's salary?",
            type: 'input'
        }, 
        {
            name: 'departmentId',
            message: "What is the new role's department id?",
            type: 'input'
        },   
        ]);
        const query = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`;
        connection.query(query, [title, parseInt(salary), departmentId], (err, result) => {
            if (err) throw err;
            console.log(`New Role Added`, result);
            connection.end();
        });
    } catch (err) {
        console.log(err);
        connection.end();
    }
}



// const addDepartment = async() => {
//   connection.query
// }

// const updateEmpl = async() => {
//   connection.query
// }

// Delete Employee
// const deleteEmpl = async () => {
//     connection.query(`SELECT * FROM employee`, async (err, employee) => {
//         if (err) throw err;
//         try {
//             const employeeToDelete = await inquirer.prompt([
//                 {
//                     message: 'Which employee would you like to delete?',
//                     name: 'deleted',
//                     type: 'list',
//                     choices: employee.map(employee => ({  }) ),
//                 }
//             ]);
//             //  Inserting, deleting, or updating returns how many rows were affected by our query
//             connection.query('DELETE FROM employee WHERE (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', employeeToDelete.employee, (err, result) => {
//                 if (err) throw err;
//                 console.log('I AM THE DELETED RESULT', result);
//                 connection.end();
//             });
//         } catch (e) {
//             connection.end();
//         }
//     });
// }
