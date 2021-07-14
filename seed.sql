--   Creating Database
DROP DATABASE IF EXISTS 

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

-- Creating Department Table 
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
);

-- Creating Role Table 
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Creating Employees Table 
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);


-- Creates new rows in Department table in all named columns
INSERT INTO department (name)
VALUES ('Management'),
('Sales'),
('Accounting'),
('Marketing'),
('HR');

-- Creates new rows in Role table in all named columns
INSERT INTO role (title, salary, department_id)
VALUES ('Regional Manager', 79000, 101),
('Sales Rep', 65000, 300),
('Receptionist', 66000, 200),
('Marketing Specialist', 66000, 200),
('HR Consultant', 75000, 401);
