-- when a store is inserted, set last_updated_date to today
DELIMITER //
CREATE TRIGGER stores_before_insert BEFORE INSERT ON stores FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;