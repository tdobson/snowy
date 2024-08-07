/**
 * Imports team data into a MySQL database. It updates existing team records based on team name
 * or inserts new ones. The function returns the team ID (either existing or new) after the operation.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_teams' table set up.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Call this function with an object containing team details, a unique import ID, and a database connection.
 * - The function checks if a team with the given name already exists in the database.
 * - If the team exists, it updates the record; otherwise, it inserts a new team.
 *
 * @param {Object} teamData - An object containing the team's details. Expected keys:
 *   - teamName: String - The name of the team.
 *   - teamDescription: String - A description of the team.
 *   - customFields - Custom fields data for the team. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For team custom fields, this should be 'team'.
 *     - {string} entityId - The UUID of the specific team instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 * @param {String} importId - A unique identifier for the import session.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 *
 * @returns {String} The UUID of the existing or new team.
 */
function importTeams(conn, instanceId, importId, teamData) {
    if (!teamData.teamName || !instanceId) {
        console.log("Team name is required.");
        return null; // Return null if the team name is not provided
    }

    var checkTeamStmt = conn.prepareStatement('SELECT * FROM sn_teams WHERE instance_id = ? AND team_name = ?');
    checkTeamStmt.setString(1, instanceId);
    checkTeamStmt.setString(2, teamData.teamName);
    var rs = checkTeamStmt.executeQuery();
    var teamId; // Variable to store the UUID of the team

    if (rs.next()) {
        teamId = rs.getString('team_id'); // Capture existing team ID
        var updateStmt = conn.prepareStatement('UPDATE sn_teams SET team_name = ?, team_description = ?, import_id = ? WHERE instance_id = ? AND team_name = ?');

        // Update the team details
        updateStmt.setString(1, teamData.teamName || rs.getString('team_name'));
        updateStmt.setString(2, teamData.teamDescription || rs.getString('team_description'));
        updateStmt.setString(3, importId);
        updateStmt.setString(4, instanceId);
        updateStmt.setString(5, teamData.teamName);

        updateStmt.execute();
        console.log("Team data updated for team name: " + teamData.teamName);

        // Handle custom fields for the existing team
        if (teamData.customFields) {
            var customFieldsImported = importCustomFields(conn, instanceId, importId, {
                entityType: 'team',
                entityId: teamId,
                fields: teamData.customFields
            });
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for team: ' + teamId);
            }
        }
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_teams (team_id, instance_id, team_name, team_description, import_id) VALUES (?, ?, ?, ?, ?)');

        // Generate a new UUID for the team
        teamId = Uuid.randomUUID().toString();

        // Insert the new team details
        insertStmt.setString(1, teamId);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, teamData.teamName);
        insertStmt.setString(4, teamData.teamDescription);
        insertStmt.setString(5, importId);

        insertStmt.execute();
        console.log("New team inserted with name: " + teamData.teamName);

        // Handle custom fields for the new team
        if (teamData.customFields) {
            var customFieldsImported = importCustomFields(conn, instanceId, importId, {
                entityType: 'team',
                entityId: teamId,
                fields: teamData.customFields
            });
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for team: ' + teamId);
            }
        }
    }

    return teamId;
}
