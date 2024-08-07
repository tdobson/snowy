/**
 * Imports or updates instance data into the 'sn_instances' table in the database. It updates existing instance records
 * based on the instance_name_key or inserts new ones. The function returns the instance ID (either existing or new)
 * after the operation.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_instances' table set up.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Call this function with an object containing instance details, a unique import ID, and a database connection.
 * - The function checks if an instance with the given instance_name_key already exists in the database.
 * - If the instance exists, it updates the record; otherwise, it inserts a new instance.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {Object} instanceData - An object containing the instance's details. Expected keys:
 *   - instance_name_key: String - Unique key or identifier for the instance (required).
 *   - instance_name: String - Name of the instance or customer.
 *   - instance_description: String - Brief description or additional information about the instance.
 *   - instance_logo_url: String - URL or file path of the logo associated with the instance.
 *   - instance_key_contact: String - Primary contact person for the instance.
 * @param {String} importId - A unique identifier for the import session.
 *
 * @returns {String} The UUID of the existing or new instance.
 */
function importInstance(conn, instanceData, importId) {
    if (!instanceData.instance_name_key) {
        console.log("Instance name key is required.");
        return null;
    }

    var checkInstanceStmt = conn.prepareStatement('SELECT * FROM sn_instances WHERE instance_name_key = ?');
    checkInstanceStmt.setString(1, instanceData.instance_name_key);
    var rs = checkInstanceStmt.executeQuery();
    var instanceId; // Variable to store the UUID of the instance

    if (rs.next()) {
        instanceId = rs.getString('instance_id'); // Capture existing instance ID
        var updateStmt = conn.prepareStatement('UPDATE sn_instances SET instance_name = ?, instance_description = ?, instance_logo_url = ?, instance_key_contact = ?, import_id = ? WHERE instance_name_key = ?');

        // Update the instance details
        updateStmt.setString(1, instanceData.instance_name || rs.getString('instance_name'));
        updateStmt.setString(2, instanceData.instance_description || rs.getString('instance_description'));
        updateStmt.setString(3, instanceData.instance_logo_url || rs.getString('instance_logo_url'));
        updateStmt.setString(4, instanceData.instance_key_contact || rs.getString('instance_key_contact'));
        updateStmt.setString(5, importId);
        updateStmt.setString(6, instanceData.instance_name_key);

        updateStmt.execute();
        console.log("Instance data updated for instance name key: " + instanceData.instance_name_key);
    } else {
        instanceId = Utilities.getUuid(); // Generate a UUID for the new instance
        var insertStmt = conn.prepareStatement('INSERT INTO sn_instances (instance_id, instance_name_key, instance_name, instance_description, instance_logo_url, instance_key_contact, import_id) VALUES (?, ?, ?, ?, ?, ?, ?)');

        // Insert a new instance
        insertStmt.setString(1, instanceId);
        insertStmt.setString(2, instanceData.instance_name_key);
        insertStmt.setString(3, instanceData.instance_name);
        insertStmt.setString(4, instanceData.instance_description);
        insertStmt.setString(5, instanceData.instance_logo_url);
        insertStmt.setString(6, instanceData.instance_key_contact);
        insertStmt.setString(7, importId);

        insertStmt.execute();
        console.log("New instance inserted with name key: " + instanceData.instance_name_key);
    }

    // Close resources
    rs.close();
    checkInstanceStmt.close();

    return instanceId; // Return the UUID of the existing or new instance
}
