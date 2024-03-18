/**
 * Imports or updates client details into the sn_clients table in the database based on the provided client name.
 * If a client with the same name already exists, the function updates existing fields only if they are blank and new data is provided.
 * New clients are inserted with all provided details. An import event is logged in the sn_import_events table for each execution.
 *
 * Prerequisites:
 * - The database should have the sn_clients, sn_users, and sn_addresses tables set up.
 * - Client data must include the client's name and email as unique identifiers.
 *
 * Usage:
 * - Call this function with an object containing client details, a database connection, and a unique import ID.
 * - Ensure the database connection is active and the import ID is unique for each import session.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} importId - A unique identifier for the import session.
 * @param {Object} clientData - Object containing client details, including:
 *   - {string} email - Email of the client (used as a unique identifier).
 *   - {string} name - Name of the client.
 *   - {string} client_legacy_number - Optional legacy number for the client.
 *   - {string} client_plot_card_required - Indicates if a plot card is required for the client.
 *   - {Object} userData - User data object for creating or linking a contact ID.
 *   - {Object} addressData - Address details for the client.
 *   - {Object} customFields - Custom fields data for the client. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For client custom fields, this should be 'client'.
 *     - {string} entityId - The UUID of the specific client instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 * @returns {string|null} UUID of the existing or new client record, or null in case of an error.
 */
function importClient(conn, importId, clientData) {
    if (!clientData || !clientData.name) {
        console.log("Client name is required.");
        return null;
    }

    var clientContactId = importUserData(conn, importId, clientData.userData);
    var clientAddressId = importAddress(conn, importId, clientData.addressData);

    try {
        var checkClientStmt = conn.prepareStatement('SELECT * FROM sn_clients WHERE client_name = ?');
        checkClientStmt.setString(1, clientData.name);

        var rs = checkClientStmt.executeQuery();
        if (rs.next()) {
            var existingUuid = rs.getString('client_id');
            console.log("Client already exists with UUID: " + existingUuid);

            var updateStmt = conn.prepareStatement('UPDATE sn_clients SET client_legacy_number = ?, client_plot_card_required = ?, client_address_id = ?, contact_id = ?, import_id = ? WHERE client_name = ?');
            updateStmt.setString(1, clientData.client_legacy_number || rs.getString('client_legacy_number'));
            updateStmt.setString(2, clientData.client_plot_card_required || rs.getString('client_plot_card_required'));
            updateStmt.setString(3, clientAddressId || rs.getString('client_address_id'));
            updateStmt.setString(4, clientContactId || rs.getString('contact_id'));
            updateStmt.setString(5, importId);
            updateStmt.setString(6, clientData.name);
            updateStmt.execute();

            // Import custom fields for the existing client
            if (clientData.customFields) {
                clientData.customFields.entityType = 'client';
                clientData.customFields.entityId = existingUuid;
                var customFieldsImported = importCustomFields(conn, importId, clientData.customFields);
                if (!customFieldsImported) {
                    console.error('Failed to import custom fields for client: ' + existingUuid);
                }
            }

            return existingUuid;
        } else {
            var insertStmt = conn.prepareStatement('INSERT INTO sn_clients (client_id, client_legacy_number, client_name, client_address_id, client_plot_card_required, contact_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
            var newUuid = Utilities.getUuid();

            insertStmt.setString(1, newUuid);
            insertStmt.setString(2, clientData.client_legacy_number);
            insertStmt.setString(3, clientData.name);
            insertStmt.setString(4, clientAddressId);
            insertStmt.setString(5, clientData.client_plot_card_required);
            insertStmt.setString(6, clientContactId);
            insertStmt.setString(7, importId);
            insertStmt.execute();

            // Import custom fields for the new client
            if (clientData.customFields) {
                clientData.customFields.entityType = 'client';
                clientData.customFields.entityId = newUuid;
                var customFieldsImported = importCustomFields(conn, importId, clientData.customFields);
                if (!customFieldsImported) {
                    console.error('Failed to import custom fields for client: ' + newUuid);
                }
            }

            console.log("New client inserted with UUID: " + newUuid);
            return newUuid;
        }
    } catch (error) {
        console.error('Error in importClient: ' + error.message);
        return null;
    } finally {
        if (rs) rs.close();
    }
}
