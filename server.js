const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();

// create the connection to database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "catalina",
    database: "employee_tracker",
});

connection.connect((err) => {
    if (err) {
        console.log("db connect err ===", err);
    }
    console.log("database connection ok ===");
    setTimeout(() => {
        console.log("welcome to my Employee Tracker program!");
        start();
    }, 1000);
});

function start() {
    inquirer
        .prompt({
            type: "list",
            name: "home_menu",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Quit",
            ],
        })
        .then(({ home_menu }) => {
            switch (home_menu) {
                case "View all Departments":
                    viewAllDepartments();
                    break;
                case "View all Roles":
                    viewAllRoles();
                    break;
                case "View all Employees":
                    viewAllEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    viewAllDepartments();
                    break;
                case "Quit":
                    quit();
                    break;

                default:
                    quit();
                    break;
            }
        });
}

function restart() {
    setTimeout(() => {
        start();
    }, 1000);
}

function viewAllDepartments() {
    const sql = `SELECT id, name FROM department`;
    connection.query(sql, (err, res) => {
        if (err) {
            console.log("viewAllDepartments error ===", err);
        }
        console.table(res);
        restart();
    });
}

function viewAllRoles() {
    const sql = `SELECT role.id, role.title, role.salary, department.name FROM role, department WHERE role.department_id = department.id;`;
    connection.query(sql, (err, res) => {
        if (err) {
            console.log("viewAllRoles error ===", err);
        }
        console.table(res);
        restart();
    });
}

function viewAllEmployees() {
    const sql = `SELECT 
                    e.id As Id,
                    e.first_name,
                    e.last_name,
                    e.title AS title,
                    e.salary AS salary,
                    e.name AS department,
                    CASE
                        WHEN e.manager_id = e.id THEN CONCAT('null')
                        ELSE CONCAT(m.first_name, ' ', m.last_name)
                    END AS manager
                FROM
                    (SELECT 
                        employee.*, department.name, role.title, role.salary, role.department_id, role.id AS roleId
                        FROM
                            employee
                            LEFT JOIN role ON employee.role_id = role.id
                            LEFT JOIN department ON role.department_id = department.id) AS e,
                    employee m
                WHERE
                    m.id = e.manager_id`;
    connection.query(sql, (err, res) => {
        if (err) {
            console.log("viewAllEmployees error ===", err);
        }
        console.table(res);
        restart();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                type: "text",
                name: "newDepartment",
                message: "Enter new department name:",
            },
        ])
        .then(({ newDepartment }) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const value = newDepartment;
            connection.query(sql, value, (err, res) => {
                if (err) {
                    console.log("addDepartment error ===", err);
                }
                console.log("add department success!");
                inquirer
                    .prompt({
                        type: "confirm",
                        name: "result",
                        message: "check added department",
                    })
                    .then(({ result }) => {
                        if (result) {
                            viewAllDepartments();
                        } else {
                            restart();
                        }
                    });
            });
        });
}

function addRole() {
    const getDepartments = new Promise((resolve, reject) => {
        let departmentList = [];
        const sql = `SELECT name FROM department`;
        connection.query(sql, (err, data) => {
            if (err) {
                console.log("get departmentList ===", err);
            }
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                departmentList.push(element['name']);
            }
            resolve(departmentList);
        });
    });

    getDepartments.then((res) => {
        inquirer
            .prompt([
                {
                    type: "text",
                    name: "roleTitle",
                    message: "What is the title of your role?",
                    validate: (input) => {
                        if (input) {
                            return true;
                        } else {
                            console.log("please enter title for your role");
                            return false;
                        }
                    },
                },
                {
                    type: "number",
                    name: "roleSalary",
                    message: "What is the salary of your role?",
                    validate: (input) => {
                        if (input) {
                            return true;
                        } else {
                            console.log("please enter salary for your role");
                            return false;
                        }
                    },
                    filter: (input) => {
                        if (!input || input === NaN) {
                            return "";
                        } else {
                            return input;
                        }
                    },
                },
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department dose the role belong to?",
                    choices: res,
                    filter: (input) => {
                        if (input) {
                            return res.indexOf(input);
                        }
                    },
                },
            ])
            .then(({ roleTitle, roleSalary, departmentId }) => {
                const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
                const data = [roleTitle, roleSalary, departmentId + 1];
                connection.query(sql, data, (err, res) => {
                    if (err) {
                        console.log("addRole error ===", err);
                    }
                    console.log("add role success!");
                    inquirer
                        .prompt({
                            type: "confirm",
                            name: "result",
                            message: "check added role",
                        })
                        .then(({ result }) => {
                            if (result) {
                                viewAllRoles();
                            } else {
                                restart();
                            }
                        });
                });
            });
    });
}

function quit() {
    console.log("Thank you. See you again.");
    setTimeout(() => {
        process.exit(1);
    }, 1000);
}
