--   Creating Database
DROP DATABASE IF EXISTS 

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);
