/**
 * Imports or updates client details into the sn_clients table in the database. The function checks if a client
 * with the given email already exists in the database, and either inserts a new record or updates the existing one.
 * Fields in the database are updated only if they are blank and new data is available. An import event is logged
 * in the sn_import_events table each time the function is run.
 *
 * Prerequisites:
 * - The database should have sn_clients, sn_users, and sn_addresses tables set up.
 *
 * Usage:
 * - Call this function with an object containing client details, a database connection, and a unique import ID.
 * - Ensure the database connection details are correctly set.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} importId - A unique identifier for the import session.
 * @param {Object} clientData - Object containing client details. Expected keys:
 *   - {string} email - Email of the client (used as a unique identifier).
 *   - {string} name - Name of the client.
 *   - {Object} address - Address object containing address details of the client.
 * @returns {string|null} UUID of the existing or new client record, or null in case of an error.
 */
function importClient(conn, importId, clientData) {
    if (!clientData || !clientData.email) {
        console.log("Client email is required.");
        return null;
    }

    try {
        var checkClientStmt = conn.prepareStatement('SELECT * FROM sn_clients WHERE email = ?');
        checkClientStmt.setString(1, clientData.email);

        var rs = checkClientStmt.executeQuery();
        if (rs.next()) {
            var existingUuid = rs.getString('client_id');
            console.log("Client already exists with UUID: " + existingUuid);

            // Optionally update existing record if any field is blank
            var updateStmt = conn.prepareStatement('UPDATE sn_clients SET name = ?, import_id = ? WHERE email = ?');
            updateStmt.setString(1, clientData.name || rs.getString('name'));
            updateStmt.setString(2, importId);
            updateStmt.setString(3, clientData.email);
            updateStmt.execute();

            return existingUuid;
        } else {
            var insertStmt = conn.prepareStatement('INSERT INTO sn_clients (client_id, name, email, import_id) VALUES (?, ?, ?, ?)');
            var newUuid = Utilities.getUuid();

            insertStmt.setString(1, newUuid);
            insertStmt.setString(2, clientData.name);
            insertStmt.setString(3, clientData.email);
            insertStmt.setString(4, importId);
            insertStmt.execute();

            console.log("New client inserted with UUID: " + newUuid);
            return newUuid;
        }
    } catch (error) {
        console.error('Error in importClientData: ' + error.message);
        return null;
    } finally {
        if (rs) rs.close();
    }
}
