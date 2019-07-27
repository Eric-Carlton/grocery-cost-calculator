-- when a store is updated, set last_updated_date to today
DELIMITER //
CREATE TRIGGER stores_before_update BEFORE UPDATE ON stores FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;