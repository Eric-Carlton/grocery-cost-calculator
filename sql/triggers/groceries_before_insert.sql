-- when a grocery is inserted, set last_updated_date to today
DELIMITER //
CREATE TRIGGER groceries_before_insert BEFORE INSERT ON groceries FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;