/**
 * Imports or updates custom fields for a specific entity in the sn_custom_fields table.
 *
 * Custom fields allow for the extension of the standard schema by adding additional attributes to entities
 * without modifying the core tables. This enables flexibility and customization for different customers or
 * instances of the application. Custom fields are stored in the sn_custom_fields table, which associates
 * the fields with specific entities using the entity_type and entity_id columns. The field_name and
 * field_value columns store the actual custom field data.
 *
 * The sn_custom_fields table has the following columns:
 * - custom_field_id (CHAR(36)): Unique identifier for each custom field record.
 * - instance_id (CHAR(36)): Foreign key referencing the instance or customer associated with the custom field.
 * - entity_type (VARCHAR(50)): Type of entity the custom field is associated with (e.g., 'client', 'project', 'site').
 * - entity_id (CHAR(36)): Unique identifier of the specific entity instance the custom field is related to.
 * - field_name (VARCHAR(255)): Name or key of the custom field.
 * - field_ui_name (VARCHAR(255)): User-editable name of the custom field.
 * - field_description (VARCHAR(255)): User-editable description of the custom field.
 * - field_value (TEXT): Actual value of the custom field.
 * - import_id (CHAR(36)): Import event that created or last updated the custom field record.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} importId - A unique identifier for the import session.
 * @param {Object} customFieldsData - Object containing custom field data.
 *   The customFieldsData object should have the following structure:
 *   {
 *     entityType: 'client', // The type of entity the custom fields belong to (e.g., 'client', 'project', 'site')
 *     entityId: 'abc123', // The UUID of the specific entity instance
 *     instanceId: 'def456', // The UUID of the instance or customer associated with the custom fields
 *     fields: {
 *       'Field 1': {
 *         value: 'Value 1',
 *         uiName: 'Custom Field 1',
 *         description: 'Description of Custom Field 1'
 *       },
 *       'Field 2': {
 *         value: 'Value 2',
 *         uiName: 'Custom Field 2',
 *         description: 'Description of Custom Field 2'
 *       },
 *       // ... more custom fields ...
 *     }
 *   }
 * @returns {boolean} True if the import is successful, false otherwise.
 */
function importCustomFields(conn, importId, customFieldsData) {
    var entityType = customFieldsData.entityType;
    var entityId = customFieldsData.entityId;
    var instanceId = customFieldsData.instanceId;
    var fields = customFieldsData.fields;

    for (var fieldName in fields) {
        if (fields.hasOwnProperty(fieldName)) {
            var fieldValue = fields[fieldName].value;
            var fieldUiName = fields[fieldName].uiName;
            var fieldDescription = fields[fieldName].description;

            try {
                var checkFieldStmt = conn.prepareStatement('SELECT * FROM sn_custom_fields WHERE instance_id = ? AND entity_type = ? AND entity_id = ? AND field_name = ?');
                checkFieldStmt.setString(1, instanceId);
                checkFieldStmt.setString(2, entityType);
                checkFieldStmt.setString(3, entityId);
                checkFieldStmt.setString(4, fieldName);

                var rs = checkFieldStmt.executeQuery();
                if (rs.next()) {
                    var updateStmt = conn.prepareStatement('UPDATE sn_custom_fields SET field_value = ?, field_ui_name = ?, field_description = ?, import_id = ? WHERE instance_id = ? AND entity_type = ? AND entity_id = ? AND field_name = ?');
                    updateStmt.setString(1, fieldValue);
                    updateStmt.setString(2, fieldUiName);
                    updateStmt.setString(3, fieldDescription);
                    updateStmt.setString(4, importId);
                    updateStmt.setString(5, instanceId);
                    updateStmt.setString(6, entityType);
                    updateStmt.setString(7, entityId);
                    updateStmt.setString(8, fieldName);
                    updateStmt.execute();
                } else {
                    var insertStmt = conn.prepareStatement('INSERT INTO sn_custom_fields (custom_field_id, instance_id, entity_type, entity_id, field_name, field_ui_name, field_description, field_value, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
                    var newUuid = Utilities.getUuid();

                    insertStmt.setString(1, newUuid);
                    insertStmt.setString(2, instanceId);
                    insertStmt.setString(3, entityType);
                    insertStmt.setString(4, entityId);
                    insertStmt.setString(5, fieldName);
                    insertStmt.setString(6, fieldUiName);
                    insertStmt.setString(7, fieldDescription);
                    insertStmt.setString(8, fieldValue);
                    insertStmt.setString(9, importId);
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
