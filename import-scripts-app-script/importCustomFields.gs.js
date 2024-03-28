/**
 * Imports or updates custom fields for a specific entity in the `sn_custom_fields` table.
 *
 * Custom fields allow for the extension of the standard schema by adding additional attributes to entities
 * without modifying the core tables. This enables flexibility and customization for different customers or
 * instances of the application. Custom fields are stored in the `sn_custom_fields` table, which associates
 * the fields with specific entities using the `entity_type` and `entity_id` columns. The `field_name` and
 * `field_value` columns store the actual custom field data.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The UUID of the instance or customer associated with the custom fields.
 * @param {string} importId - A unique identifier for the import session.
 * @param {Object} customFieldsData - Object containing custom field data.
 *   The `customFieldsData` object should have the following structure:
 *   ```javascript
 *   {
 *     entityType: 'client', // The type of entity the custom fields belong to (e.g., 'client', 'project', 'site')
 *     entityId: 'abc123', // The UUID of the specific entity instance
 *     fields: {
 *       'Field 1': 'Value 1', // Key-value pairs of custom field names and their corresponding values
 *       'Field 2': 'Value 2',
 *       // ... more custom fields ...
 *     }
 *   }
 *   ```
 * @returns {boolean} `true` if the import is successful, `false` otherwise.
 *
 * @example
 * const conn = getActiveJdbcConnection(); // Assuming you have a method to get an active JDBC connection
 * const instanceId = 'my-instance-id';
 * const importId = 'my-import-session-id';
 * const customFieldsData = {
 *   entityType: 'client',
 *   entityId: 'abc123',
 *   fields: {
 *     'Client Email': 'john.doe@example.com',
 *     'Client Phone': '555-1234',
 *     'Client Address': '123 Main St, Anytown USA'
 *   }
 * };
 *
 * const success = importCustomFields(conn, instanceId, importId, customFieldsData);
 * if (success) {
 *   console.log('Custom fields imported successfully!');
 * } else {
 *   console.error('Error importing custom fields.');
 * }
 */
function importCustomFields(conn, instanceId, importId, customFieldsData) {
    var entityType = customFieldsData.entityType;
    var entityId = customFieldsData.entityId;
    var fields = customFieldsData.fields;

    console.log('Importing custom fields for entity: ' + entityType + ' (' + entityId + ')');

    for (var fieldName in fields) {
        if (fields.hasOwnProperty(fieldName)) {
            var fieldValue = fields[fieldName];
            var fieldUiName = fieldName;
            var fieldDescription = '';

            try {
                var checkFieldStmt = conn.prepareStatement('SELECT * FROM sn_custom_fields WHERE instance_id = ? AND entity_type = ? AND entity_id = ? AND field_name = ?');
                checkFieldStmt.setString(1, instanceId);
                checkFieldStmt.setString(2, entityType);
                checkFieldStmt.setString(3, entityId);
                checkFieldStmt.setString(4, fieldName);

                var rs = checkFieldStmt.executeQuery();
                if (rs.next()) {
                    console.log('Updating custom field: ' + fieldName);
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
                    console.log('Inserting custom field: ' + fieldName);
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

    console.log('Custom fields imported successfully for entity: ' + entityType + ' (' + entityId + ')');
    return true;
}
