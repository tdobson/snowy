/**
 * Imports slot data into a MySQL database. It updates existing slot records or inserts new ones.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} importId - The ID of the current import session.
 * @param {Object} slotData - An object containing the slot's details.
 *
 * @returns {string} The UUID of the existing or new slot.
 */
function importSlotData(conn, instanceId, importId, slotData) {
    if (!slotData.date || !slotData.slotNumber || !instanceId) {
        console.log("Date and Slot Number are required.");
        return null;
    }

    var checkSlotStmt = conn.prepareStatement('SELECT * FROM sn_slots WHERE instance_id = ? AND date = ? AND time_slot = ?');
    checkSlotStmt.setString(1, instanceId);
    checkSlotStmt.setDate(2, new Date(slotData.date));
    checkSlotStmt.setString(3, slotData.slotNumber);
    var rs = checkSlotStmt.executeQuery();
    var slotId;

    if (rs.next()) {
        slotId = rs.getString('slot_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_slots SET job_id = ?, import_id = ? WHERE slot_id = ?');

        updateStmt.setString(1, slotData.jobId);
        updateStmt.setString(2, importId);
        updateStmt.setString(3, slotId);

        updateStmt.execute();
        console.log("Slot data updated for date: " + slotData.date + ", slot: " + slotData.slotNumber);
    } else {
        slotId = Utilities.getUuid();
        var insertStmt = conn.prepareStatement('INSERT INTO sn_slots (slot_id, instance_id, date, time_slot, job_id, import_id) VALUES (?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, slotId);
        insertStmt.setString(2, instanceId);
        insertStmt.setDate(3, new Date(slotData.date));
        insertStmt.setString(4, slotData.slotNumber);
        insertStmt.setString(5, slotData.jobId);
        insertStmt.setString(6, importId);

        insertStmt.execute();
        console.log("New slot inserted for date: " + slotData.date + ", slot: " + slotData.slotNumber);
    }

    rs.close();
    checkSlotStmt.close();

    return slotId;
}
