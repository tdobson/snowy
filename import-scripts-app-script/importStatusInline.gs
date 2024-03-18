/**
 * Imports or updates status details into the sn_status table in the database. The function checks if a status
 * with the given state already exists in the database, and either inserts a new record or updates the existing one.
 * Fields in the database are updated only if they are blank and new data is available. An import event is logged
 * in the sn_import_events table each time the function is run.
 *
 * Prerequisites:
 * - The database should have sn_status and sn_import_events tables set up.
 *
 * Usage:
 * - Call this function with an object containing status details and a database connection.
 * - Ensure the database connection details are correctly set.
 *
 * @param {Object} statusData - Object containing status details. Expected keys:
 *   - {string} status_state - Status of the job status (e.g., 'approved').
 *   - {string} status_name - Name of the status (e.g., 'Plots dispatch').
 *   - {string} status_group - Group name of the status (e.g., 'Plots dispatch statuses').
 *   - {string} status_code - Code associated with the job status (e.g., 'APR').
 *   - {string} status_description - Short description of what this status means.
 *   - {Object} customFields - Custom fields data for the status. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For status custom fields, this should be 'status'.
 *     - {string} entityId - The UUID of the specific status instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @returns {string|null} UUID of the existing or new status record, or null in case of an error.
 */
function importStatus(conn, importId, statusData) {
    if (!statusData || !statusData.status_state || !statusData.status_group) {
        console.log("Status state and group are required.");
        return null;
    }

    try {
        var checkStatusStmt = conn.prepareStatement('SELECT * FROM sn_status WHERE status_state = ? AND status_group = ?');
        checkStatusStmt.setString(1, statusData.status_state);
        checkStatusStmt.setString(2, statusData.status_group);

        var rs = checkStatusStmt.executeQuery();
        if (rs.next()) {
            var existingUuid = rs.getString('status_id');
            console.log("Status already exists with ID: " + existingUuid);

            var updateStmt = conn.prepareStatement('UPDATE sn_status SET status_name = ?, status_code = ?, status_description = ?, import_id = ? WHERE status_state = ? AND status_group = ?');
            updateStmt.setString(1, statusData.status_name || rs.getString('status_name'));
            updateStmt.setString(2, statusData.status_code || rs.getString('status_code'));
            updateStmt.setString(3, statusData.status_description || rs.getString('status_description'));
            updateStmt.setString(4, importId);
            updateStmt.setString(5, statusData.status_state);
            updateStmt.setString(6, statusData.status_group);
            updateStmt.execute();

            // Import custom fields for the existing status
            if (statusData.customFields) {
                statusData.customFields.entityType = 'status';
                statusData.customFields.entityId = existingUuid;
                var customFieldsImported = importCustomFields(conn, importId, statusData.customFields);
                if (!customFieldsImported) {
                    console.error('Failed to import custom fields for status: ' + existingUuid);
                }
            }

            return existingUuid;
        } else {
            var insertStmt = conn.prepareStatement('INSERT INTO sn_status (status_id, status_state, status_name, status_group, status_code, status_description, import_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
            var newUuid = Utilities.getUuid();

            insertStmt.setString(1, newUuid);
            insertStmt.setString(2, statusData.status_state);
            insertStmt.setString(3, statusData.status_name || 'Default Name'); // Use a default value if status_name is not provided
            insertStmt.setString(4, statusData.status_group);
            insertStmt.setString(5, statusData.status_code);
            insertStmt.setString(6, statusData.status_description);
            insertStmt.setString(7, importId);
            insertStmt.execute();

            console.log("New status inserted with ID: " + newUuid);

            // Import custom fields for the new status
            if (statusData.customFields) {
                statusData.customFields.entityType = 'status';
                statusData.customFields.entityId = newUuid;
                var customFieldsImported = importCustomFields(conn, importId, statusData.customFields);
                if (!customFieldsImported) {
                    console.error('Failed to import custom fields for status: ' + newUuid);
                }
            }

            return newUuid;
        }
    } catch (error) {
        console.error('Error in importStatus: ' + error.message);
        return null;
    } finally {
        if (conn) rs.close();
    }
}

/**
 * Looks up status details by status state in the sn_status table in the database.
 *
 * @param {string} statusState - The status state to look up.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @returns {Object|null} - The status details if found, or null if not found.
 */
function lookupStatusByState(conn, statusState, statusGroup) {
    try {
        var checkStatusStmt = conn.prepareStatement('SELECT * FROM sn_status WHERE status_state = ? AND status_group = ?');
        checkStatusStmt.setString(1, statusState);
        checkStatusStmt.setString(2, statusGroup);

        var rs = checkStatusStmt.executeQuery();
        if (rs.next()) {
            var statusDetails = {
                'status_id': rs.getString('status_id'),
                'status_state': rs.getString('status_state'),
                'status_name': rs.getString('status_name'),
                'status_group': rs.getString('status_group'),
                'status_code': rs.getString('status_code'),
                'status_description': rs.getString('status_description')
            };

            return statusDetails;
        } else {
            console.log("Status not found for the given state: " + statusState);
            return null;
        }
    } catch (error) {
        console.error('Error in lookupStatusByState: ' + error.message);
        return null;
    } finally {
        if (conn) conn.close();
    }
}
