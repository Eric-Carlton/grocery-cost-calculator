CREATE DATABASE IF NOT EXISTS groceries;
USE groceries;
CREATE TABLE IF NOT EXISTS stores (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);