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
                    'Add Employee',
                    'Add Role',
                    'Add Department',
                    'Update Employee',
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
        case 'Update Employee':
            updateEmpl();
            break;
    }
};
// View All Employees
const getAllEmpl = async () => {
    try {
        const employee = await connection.query('SELECT * FROM employee');
        console.table(employee);
        firstPrompt();
    } catch (err) {
        console.log(err);
    }
};
// View all Employees By Roles
const getAllEmplRole = async () => {
    try {
        const role = await connection.query('SELECT * FROM role');
        console.table(role);
        firstPrompt()
    } catch (err) {
        console.log(err);
    }
};
// View all Employees By Deparments
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
                    type: 'input',
                },
                {
                    name: 'last_name',
                    message: "What is the employee's last name?",
                    type: 'input',
                },
                {
                    name: 'role_id',
                    message: "What is the employee's role?",
                    type: 'list',
                    choices: positions.map(title => ({ name: title.title, value: title.id }))
                }
            ]);
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, 1)';
            connection.query(query, [answer.first_name, answer.last_name, answer.role_id], (err, result) => {
                if (err) throw err;
                console.log('Employee added!', result);
                firstPrompt();
            });
        } catch (err) {
            console.log(err);
            connection.end();
        }
    });
};
// Add Role
const addRole = () => {
    connection.query('SELECT title, id FROM role', async (err, roles) => {
        if (err) throw err;
        try {
            const { title, salary, departmentId } = await inquirer.prompt([
                {
                    name: 'title',
                    message: 'What is the title of new role?',
                    type: 'input',
                },
                {
                    name: 'salary',
                    message: "What is the new role's salary?",
                    type: 'input',
                },
                {
                    name: 'departmentId',
                    message: "What is the new role's department id?",
                    type: 'list',
                    choices: roles.map(options => ({ name: options.name, value: options.id }))
                }
            ]);
            const query = `INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)`;
            connection.query(query, [title, parseInt(salary), departmentId], (err, result) => {
                if (err) throw err;
                console.log(`New Role Added`, result);
                firstPrompt();
            });
        } catch (err) {
            console.log(err);
            connection.end();
        }
    });
};
// Add Department 
const addDepartment = async () => {
    try {
        const newDepartment = await inquirer.prompt([
            {
                name: "name",
                message: "What Department would you like to add?",
                type: "input"
            }
        ]);
        connection.query(`INSERT INTO department(name) VALUES (?)`, newDepartment.name);
        console.log(`Added New Department ${newDepartment.name}`);
        firstPrompt();
    } catch (err) {
        console.log(err);
        connection.end();
    }
};
// Updating Employee
const updateEmpl = async () => {
    const allEmployees = await connection.query('SELECT first_name, last_name, role_id, id  FROM employee')
    try {
        const updating = await inquirer.prompt([
            {
                name: "e",
                message: "Select an employee to update:",
                type: "list",
                choices: allEmployees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
            },
            {
                name: "column",
                message: "What do you want to update?",
                type: "list",
                choices: ['First Name', 'Last Name', 'Role', 'Salary']
            }
        ]);
        // Switch Case (User Options to update)       
        switch (updating.column) {
            case 'First Name':
                const { first_name } = await inquirer.prompt([
                    {
                        name: "first_name",
                        type: 'input',
                        message: "What is the First Name?"
                    }
                ]);
                connection.query(`UPDATE employee SET first_name = ? WHERE id = ?`, [first_name, updating.e]);
                break
            case 'Last Name':
                const { last_name } = await inquirer.prompt([
                    {
                        name: "last_name",
                        type: 'input',
                        message: "What is the Last Name?"
                    }
                ]);
                connection.query(`UPDATE employee SET last_name = ? WHERE id = ?`, [last_name, updating.e]);
                break
            case 'Role':
                const { role } = await inquirer.prompt([
                    {
                        name: "role",
                        type: 'input',
                        message: "Change Role's id?"
                    }
                ]);
                connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [parseInt(role), updating.e]);
                break
            case 'Salary':
                const { salary } = await inquirer.prompt([
                    {
                        name: "salary",
                        type: "input",
                        message: "What is the updated Salary?"
                    }
                ]);
                let selectedEmployee = allEmployees.filter((item) => {return item.id === updating.e});
                console.log(selectedEmployee[0].role_id)

                connection.query(`UPDATE role SET salary = ? WHERE id = ?`, [parseInt(salary), selectedEmployee[0].role_id]);
                break
        };

        console.log('All Done');
        firstPrompt();
    } catch (err) {
        console.log(err);
        connection.end();
    }
};









