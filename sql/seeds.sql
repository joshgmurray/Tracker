
-- create employee_tracker database and select it for use
DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;
USE employee_tracker;

-- define table schemas
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

-- insert table data
INSERT INTO department (name)
    VALUES ('Corporate'),('Sales'),('IT'),('Human Resources'),('Marketing');

INSERT INTO role (title, salary, department_id)
    VALUES
    ('CEO', 8200.5, 1),
    ('Sales Associate', 6200.3, 1),
    ('Tech Advisor', 5000, 1),
    ('Head of HR', 3200.5, 1),
    ('Market Analyst', 7500, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES
    ('John', 'Smith', 1, 1),
    ('Sue', 'Storm', 2, 1),
    ('Peter', 'Parker', 3, 1),
    ('Ben', 'Johnson', 2, 1),
    ('Carrie', 'Carter', 5, 1);