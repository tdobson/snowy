/**
 * Imports or updates custom fields for a specific entity in the sn_custom_fields table.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} importId - A unique identifier for the import session.
 * @param {Object} customFieldsData - Object containing custom field data.
 *   The customFieldsData object should have the following structure:
 *   {
 *     entityType: 'client', // The type of entity the custom fields belong to (e.g., 'client', 'project', 'site')
 *     entityId: 'abc123', // The UUID of the specific entity instance
 *     fields: {
 *       'Field 1': 'Value 1',
 *       'Field 2': 'Value 2',
 *       // ... more custom fields ...
 *     }
 *   }
 * @returns {boolean} True if the import is successful, false otherwise.
 */
function importCustomFields(conn, importId, customFieldsData) {
    var entityType = customFieldsData.entityType;
    var entityId = customFieldsData.entityId;
    var fields = customFieldsData.fields;

    for (var fieldName in fields) {
        if (fields.hasOwnProperty(fieldName)) {
            var fieldValue = fields[fieldName];

            try {
                var checkFieldStmt = conn.prepareStatement('SELECT * FROM sn_custom_fields WHERE entity_type = ? AND entity_id = ? AND field_name = ?');
                checkFieldStmt.setString(1, entityType);
                checkFieldStmt.setString(2, entityId);
                checkFieldStmt.setString(3, fieldName);

                var rs = checkFieldStmt.executeQuery();
                if (rs.next()) {
                    var updateStmt = conn.prepareStatement('UPDATE sn_custom_fields SET field_value = ?, import_id = ? WHERE entity_type = ? AND entity_id = ? AND field_name = ?');
                    updateStmt.setString(1, fieldValue);
                    updateStmt.setString(2, importId);
                    updateStmt.setString(3, entityType);
                    updateStmt.setString(4, entityId);
                    updateStmt.setString(5, fieldName);
                    updateStmt.execute();
                } else {
                    var insertStmt = conn.prepareStatement('INSERT INTO sn_custom_fields (custom_field_id, entity_type, entity_id, field_name, field_value, import_id) VALUES (?, ?, ?, ?, ?, ?)');
                    var newUuid = Utilities.getUuid();

                    insertStmt.setString(1, newUuid);
                    insertStmt.setString(2, entityType);
                    insertStmt.setString(3, entityId);
                    insertStmt.setString(4, fieldName);
                    insertStmt.setString(5, fieldValue);
                    insertStmt.setString(6, importId);
                    insertStmt.execute();
                }
            } catch (error) {
                console.error('Error importing custom field "' + fieldName + '": ' + error.message);
                return false;
            } finally {
                if (rs) rs.close();
            }
        }
    }

    return true;
}
