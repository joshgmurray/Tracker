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
                    viewAllDepartments();
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

function quit() {
    console.log("Thank you. See you again.");
    setTimeout(() => {
        process.exit(1);
    }, 1000);
}
