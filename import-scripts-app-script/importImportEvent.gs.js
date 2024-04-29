/**
 * Inserts an import event into the sn_import_events table and returns the import_id.
 *
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {string} instanceId - The instance ID to which the import event is associated.
 * @param {string} importRef - Reference identifier for the import event.
 * @param {string} source - Source of the imported data.
 * @param {string} notes - Additional notes or comments about the import event.
 * @param {string} userId - User ID of the user performing the import.
 * @returns {string} The generated UUID for the new import event.
 */
function insertImportEvent(conn, instanceId, importRef, source, notes, userId) {
    var importId = Utilities.getUuid();
    var currentDate = new Date();
    var unixDate = Math.floor(currentDate.getTime() / 1000);
    var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    var importStmt = conn.prepareStatement('INSERT INTO sn_import_events '
        + '(import_id, instance_id, import_date, imported_by, modified_date, modified_by, modification_ref, import_ref, import_source, import_notes) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    importStmt.setString(1, importId);
    importStmt.setString(2, instanceId); // Add the instance ID to the insert statement
    importStmt.setString(3, formattedDate);
    importStmt.setString(4, userId); // imported_by
    importStmt.setString(5, formattedDate); // modified_date
    importStmt.setString(6, userId); // modified_by
    importStmt.setString(7, ''); // modification_ref, assuming no value for new import, can be updated later
    importStmt.setString(8, importRef);
    importStmt.setString(9, source);
    importStmt.setString(10, notes);

    importStmt.execute();

    // Import custom fields for the existing elevation specification
    if (formattedDate) {
        var importEventData = {}
        importEventData.customFields = {
            entityType: "importEvent",
            fields: {
                last_modified_unix: unixDate
            }
        }
        importEventData.customFields.entityType = 'importEvent';
        importEventData.customFields.entityId = importId;
        importEventData.customFields.instanceId = instanceId;
        var customFieldsImported = importCustomFields(conn,instanceId, importId, importEventData.customFields);
        if (!customFieldsImported) {
            console.error('Failed to import custom fields for import event: ' + existingUuid);
        }
    }

    return importId;
}

/**
 * Inserts or updates an import event in the sn_import_events table. This function handles both new event insertion
 * and updating existing events based on the provided event details. If an import_id is provided and valid, the function
 * updates the existing event; otherwise, it creates a new event.
 *
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {Object} eventData - An object containing the details of the event. Expected properties:
 *   - {string} [importId] - (Optional) The import ID of an existing event to update.
 *   - {string} importRef - Reference identifier for the event.
 *   - {string} source - Source of the imported data.
 *   - {string} notes - Additional notes or comments about the event.
 *   - {string} userId - User ID of the user performing the operation.
 * @returns {string} The import_id of the inserted or updated event.
 */
function insertOrUpdateImportEvent(conn, eventData) {
    var currentDate = new Date();
    var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    if (eventData.importId) {
        // Update existing event
        var updateStmt = conn.prepareStatement('UPDATE sn_import_events SET modified_date = ?, modified_by = ?, import_notes = ?, import_source = ? WHERE import_id = ?');
        updateStmt.setString(1, formattedDate);
        updateStmt.setString(2, eventData.userId);
        updateStmt.setString(3, eventData.notes);
        updateStmt.setString(4, eventData.source);
        updateStmt.setString(5, eventData.importId);
        updateStmt.execute();

        return eventData.importId;
    } else {
        // Insert new event
        var newImportId = Utilities.getUuid();
        var insertStmt = conn.prepareStatement('INSERT INTO sn_import_events '
            + '(import_id, import_date, imported_by, modified_date, modified_by, modification_ref, import_ref, import_source, import_notes) '
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, newImportId);
        insertStmt.setString(2, formattedDate);
        insertStmt.setString(3, eventData.userId);
        insertStmt.setString(4, formattedDate);
        insertStmt.setString(5, eventData.userId);
        insertStmt.setString(6, ''); // Assuming no modification_ref for new event
        insertStmt.setString(7, eventData.importRef);
        insertStmt.setString(8, eventData.source);
        insertStmt.setString(9, eventData.notes);
        insertStmt.execute();

        return newImportId;
    }
}



/**
 * Inserts or updates an event in the sn_import_events table. If an event with the given importRef already exists,
 * it updates the modification details; otherwise, it inserts a new event and returns the import_id.
 *
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {string} importRef - Reference identifier for the event.
 * @param {string} source - Source of the imported data.
 * @param {string} notes - Additional notes or comments about the event.
 * @param {string} userId - User ID of the user performing the operation.
 * @returns {string} The import_id of the existing or new event.
 */
function insertUpdateEvent(conn, importRef, source, notes, userId) {
    var currentDate = new Date();
    var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    // Check if the event with the given importRef exists
    var checkEventStmt = conn.prepareStatement('SELECT * FROM sn_import_events WHERE import_ref = ?');
    checkEventStmt.setString(1, importRef);
    var rs = checkEventStmt.executeQuery();

    if (rs.next()) {
        // Event exists, update the modification details
        var existingImportId = rs.getString('import_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_import_events SET modified_date = ?, modified_by = ?, import_notes = ?, import_source = ? WHERE import_id = ?');

        updateStmt.setString(1, formattedDate);
        updateStmt.setString(2, userId);
        updateStmt.setString(3, notes);
        updateStmt.setString(4, source);
        updateStmt.setString(5, existingImportId);

        updateStmt.execute();
        return existingImportId;
    } else {
        // Insert a new event
        var newImportId = Utilities.getUuid();
        var insertStmt = conn.prepareStatement('INSERT INTO sn_import_events '
            + '(import_id, import_date, imported_by, modified_date, modified_by, modification_ref, import_ref, import_source, import_notes) '
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, newImportId);
        insertStmt.setString(2, formattedDate);
        insertStmt.setString(3, userId);
        insertStmt.setString(4, formattedDate);
        insertStmt.setString(5, userId);
        insertStmt.setString(6, ''); // Assuming no modification_ref for new event
        insertStmt.setString(7, importRef);
        insertStmt.setString(8, source);
        insertStmt.setString(9, notes);

        insertStmt.execute();
        return newImportId;
    }
}

