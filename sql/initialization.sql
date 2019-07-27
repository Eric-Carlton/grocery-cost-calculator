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

CREATE TABLE IF NOT EXISTS stores (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    last_updated_date DATE NOT NULL
);

-- when a grocery is inserted, set last_updated_date to today
DELIMITER //
CREATE TRIGGER groceries_before_insert BEFORE INSERT ON groceries FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;

-- when a grocery is updated, set last_updated_date to today
DELIMITER //
CREATE TRIGGER groceries_before_update BEFORE UPDATE ON groceries FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;

-- if a store is deleted, delete all associated groceries
DELIMITER //
CREATE TRIGGER stores_after_delete AFTER DELETE ON stores FOR EACH ROW
BEGIN
	DELETE FROM groceries WHERE store_id = OLD.id;
END; //
DELIMITER ;

-- when a store is inserted, set last_updated_date to today
DELIMITER //
CREATE TRIGGER stores_before_insert BEFORE INSERT ON stores FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;

-- test

-- when a store is updated, set last_updated_date to today
DELIMITER //
CREATE TRIGGER stores_before_update BEFORE UPDATE ON stores FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;

