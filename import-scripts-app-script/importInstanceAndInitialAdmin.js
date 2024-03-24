/**
 * Inserts a new user into the 'sn_users' table or returns the UUID of an existing user based on the email and instance ID.
 * This function first checks if a user with the given email already exists in the specified instance.
 * If the user exists, it returns the existing UUID. Otherwise, it inserts a new user with the provided details and returns the new UUID.
 *
 * @param {JdbcConnection} conn - The active JDBC connection to the database.
 * @param {string} instanceId - The UUID of the instance to which the user belongs.
 * @param {Object} userObject - An object containing the user's details.
 * @param {string} userObject.name - The full name of the user.
 * @param {string} userObject.email - The email address of the user. This is used to check for existing users.
 * @param {string} userObject.employer - The name of the user's employer.
 * @param {string} userObject.companyRole - The user's role within their company.
 * @param {string} userObject.snowyRole - The user's role within the Snowy application.
 * @returns {string} The UUID of the existing or newly inserted user.
 */
function insertUserAndGetUuid(conn, instanceId, userObject) {
    var checkStmt = conn.prepareStatement('SELECT user_id FROM sn_users WHERE email = ? AND instance_id = ?');
    checkStmt.setString(1, userObject.email);
    checkStmt.setString(2, instanceId);
    var rs = checkStmt.executeQuery();

    if (rs.next()) {
        return rs.getString('user_id');
    } else {
        var uuid = Utilities.getUuid();
        var stmt = conn.prepareStatement('INSERT INTO sn_users (user_id, name, email, employer, company_role, snowy_role, instance_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
        stmt.setString(1, uuid);
        stmt.setString(2, userObject.name);
        stmt.setString(3, userObject.email);
        stmt.setString(4, userObject.employer);
        stmt.setString(5, userObject.companyRole);
        stmt.setString(6, userObject.snowyRole);
        stmt.setString(7, instanceId);
        stmt.execute();
        return uuid;
    }
}

/**
 * Inserts a new instance into the 'sn_instances' table or returns the UUID of an existing instance based on the instance name key.
 * This function first checks if an instance with the given name key already exists.
 * If the instance exists, it returns the existing UUID. Otherwise, it inserts a new instance with the provided details,
 * creates an initial admin user for this instance using the `insertUserAndGetUuid()` function, and returns the new UUIDs for both the instance and the user.
 *
 * @param {JdbcConnection} conn - The active JDBC connection to the database.
 * @param {Object} clientObject - An object containing the client's (instance's) details.
 * @param {string} clientObject.instanceNameKey - A unique key to identify the instance. Used to check for existing instances.
 * @param {string} clientObject.instanceName - The name of the instance.
 * @param {string} clientObject.instanceDescription - A description of the instance.
 * @param {Object} clientObject.userObject - An object containing the initial admin user's details for this instance. Passed to `insertUserAndGetUuid()`.
 * @returns {Object} An object containing the UUIDs of the instance and the initial admin user.
 */
function insertInstanceAndGetUuid(conn, clientObject) {
    var checkStmt = conn.prepareStatement('SELECT instance_id FROM sn_instances WHERE instance_name_key = ?');
    checkStmt.setString(1, clientObject.instanceNameKey);
    var rs = checkStmt.executeQuery();

    if (rs.next()) {
        var existingInstanceId = rs.getString('instance_id');
        var userId = insertUserAndGetUuid(conn, existingInstanceId, clientObject.userObject);
        return { instanceId: existingInstanceId, adminUserId: userId };
    } else {
        var uuid = Utilities.getUuid();
        var userId = insertUserAndGetUuid(conn, uuid, clientObject.userObject);
        var stmt = conn.prepareStatement('INSERT INTO sn_instances (instance_id, instance_name_key, instance_name, instance_description, instance_key_contact) VALUES (?, ?, ?, ?, ?)');
        stmt.setString(1, uuid);
        stmt.setString(2, clientObject.instanceNameKey);
        stmt.setString(3, clientObject.instanceName);
        stmt.setString(4, clientObject.instanceDescription);
        stmt.setString(5, userId);
        stmt.execute();
        return { instanceId: uuid, adminUserId: userId };
    }
}
