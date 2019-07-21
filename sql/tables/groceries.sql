CREATE DATABASE IF NOT EXISTS groceries;
USE groceries;
CREATE TABLE IF NOT EXISTS groceries (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    unit ENUM('EA', 'LB') NOT NULL,
    cost_per_unit DECIMAL(6,2) NOT NULL,
    store_id INT NOT NULL,
    last_updated_date DATE NOT NULL,
    CONSTRAINT UNIQUE store_item (name, store_id)
);