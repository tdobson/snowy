
/*
var testData12399 = {
    sso_id: "123456789",             // Single Sign-On identifier, if applicable
    name: "John Doe",                // Full name of the user
    email: "johndoe@example.com",    // Email address of the user
    phone: "123-456-7890",           // Phone number of the user
    employer: "Example Corp",        // Name of the user's employer
    team: "team_uuid_here",          // Team identifier, linking to the 'sn_teams' table
    dispatch_id: "dispatch123",      // Dispatch identifier, if applicable
    snowy_role: "Administrator",     // Role within the Snowy application
    company_role: "Manager",         // Role within their company
    category: "Human"                // Category (e.g., Human, Company, etc.)
};
*/

/**
 * Imports user data into the database.
 *
 * @param {Object} userData - The user data object to be imported.
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {String} importId - The import ID from the original import.
 */
function importUserData(userData, importId, conn) {
  // 1) Check if email is present
  if (!userData.email) {
    console.log("Email is required.");
    return;
  }

  // 2) Check if the email is already present in the database
  var checkEmailStmt = conn.prepareStatement('SELECT * FROM sn_users WHERE email = ?');
  checkEmailStmt.setString(1, userData.email);
  var rs = checkEmailStmt.executeQuery();

  if (rs.next()) {
    // Email exists, update blank fields
    var updateStmt = conn.prepareStatement('UPDATE sn_users SET sso_id = ?, name = ?, phone = ?, employer = ?, team = ?, dispatch_id = ?, snowy_role = ?, company_role = ?, category = ?, import_id = ? WHERE email = ?');

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
    // 3) Email isn't present, insert new data
    var insertStmt = conn.prepareStatement('INSERT INTO sn_users (user_id, sso_id, name, email, phone, employer, team, dispatch_id, snowy_role, company_role, import_id, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    var uuid = Utilities.getUuid(); // Generate a UUID for the new user
    insertStmt.setString(1, uuid);
    insertStmt.setString(2, userData.sso_id);
    insertStmt.setString(3, userData.name);
    insertStmt.setString(4, userData.email);
    insertStmt.setString(5, userData.phone);
    insertStmt.setString(6, userData.employer);
    insertStmt.setString(7, userData.team);
    insertStmt.setString(8, userData.dispatch_id);
    insertStmt.setString(9, userData.snowy_role);
    insertStmt.setString(10, userData.company_role);
    insertStmt.setString(11, importId);
    insertStmt.setString(12, userData.category);

    insertStmt.execute();
    console.log("New user inserted with email: " + userData.email);
  }

  // Close resources
  rs.close();
  checkEmailStmt.close();
}
