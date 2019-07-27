-- if a store is deleted, delete all associated groceries
DELIMITER //
CREATE TRIGGER stores_after_delete AFTER DELETE ON stores FOR EACH ROW
BEGIN
	DELETE FROM groceries WHERE store_id = OLD.id;
END; //
DELIMITER ;