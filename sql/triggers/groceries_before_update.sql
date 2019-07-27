-- when a grocery is updated, set last_updated_date to today
DELIMITER //
CREATE TRIGGER groceries_before_update BEFORE UPDATE ON groceries FOR EACH ROW
BEGIN
	SET NEW.last_updated_date = SYSDATE();
END; //
DELIMITER ;