/**
 * Imports user data into a MySQL database. It updates existing user records based on email
 * or inserts new ones. The function returns the user ID (either existing or new) after the operation.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_users' table set up.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Call this function with an object containing user details, a unique import ID, and a database connection.
 * - The function checks if a user with the given email already exists in the database.
 * - If the user exists, it updates the record; otherwise, it inserts a new user.
 *
 * @param {Object} userData - An object containing the user's details. Expected keys:
 *   - sso_id: String - Single Sign-On identifier, if applicable.
 *   - name: String - Full name of the user.
 *   - email: String - Email address of the user.
 *   - phone: String - Phone number of the user.
 *   - employer: String - Name of the user's employer.
 *   - team: String - Team identifier, linking to the 'sn_teams' table.
 *   - dispatch_id: String - Dispatch identifier, if applicable.
 *   - snowy_role: String - Role within the Snowy application.
 *   - company_role: String - Role within their company.
 *   - category: String - Category (e.g., Human, Company, etc.).
 * @param {String} importId - A unique identifier for the import session.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 *
 * @returns {String} The UUID of the existing or new user.
 */
function importUserData(userData, importId, conn) {
  if (!userData.email) {
    console.log("Email is required.");
    return null; // Return null if the email is not provided
  }

  var checkEmailStmt = conn.prepareStatement('SELECT * FROM sn_users WHERE email = ?');
  checkEmailStmt.setString(1, userData.email);
  var rs = checkEmailStmt.executeQuery();
  var userId; // Variable to store the UUID of the user

  if (rs.next()) {
    userId = rs.getString('user_id'); // Capture existing user ID
    var updateStmt = conn.prepareStatement('UPDATE sn_users SET sso_id = ?, name = ?, phone = ?, employer = ?, team = ?, dispatch_id = ?, snowy_role = ?, company_role = ?, category = ?, import_id = ? WHERE email = ?');

    // Update the user details
    updateStmt.setString(1, userData.sso_id || rs.getString('sso_id'));
    updateStmt.setString(2, userData.name || rs.getString('name'));
    updateStmt.setString(3, userData.phone || rs.getString('phone'));
    updateStmt.setString(4, userData.employer || rs.getString('employer'));
    updateStmt.setString(5, userData.team || rs.getString('team'));
    updateStmt.setString(6, userData.dispatch_id || rs.getString('dispatch_id'));
    updateStmt.setString(7, userData.snowy_role || rs.getString('snowy_role'));
    updateStmt.setString(8, userData.company_role || rs.getString('company_role'));
    updateStmt.setString(9, userData.category || rs.getString('category'));
    updateStmt.setString(10, importId);
    updateStmt.setString(11, userData.email);

    updateStmt.execute();
    console.log("User data updated for email: " + userData.email);
  } else {
    userId = Utilities.getUuid(); // Generate a UUID for the new user
    var insertStmt = conn.prepareStatement('INSERT INTO sn_users (user_id, sso_id, name, email, phone, employer, team, dispatch_id, snowy_role, company_role, category, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    // Insert a new user
    insertStmt.setString(1, userId);
    insertStmt.setString(2, userData.sso_id);
    insertStmt.setString(3, userData.name);
    insertStmt.setString(4, userData.email);
    insertStmt.setString(5, userData.phone);
    insertStmt.setString(6, userData.employer);
    insertStmt.setString(7, userData.team);
    insertStmt.setString(8, userData.dispatch_id);
    insertStmt.setString(9, userData.snowy_role);
    insertStmt.setString(10, userData.company_role);
    insertStmt.setString(11, userData.category);
    insertStmt.setString(12, importId);

    insertStmt.execute();
    console.log("New user inserted with email: " + userData.email);
  }

  // Close resources
  rs.close();
  checkEmailStmt.close();

  return userId; // Return the UUID of the existing or new user
}
