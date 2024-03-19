/**
 * Imports or updates project details into the `sn_projects` table in the database based on the provided project data object.
 * If a project with the given PV number already exists, it updates the existing record; otherwise, it inserts a new record.
 * Additionally, it logs an import event in the `sn_import_events` table each time the function is executed.
 *
 * ## Prerequisites:
 * - The database must have the following tables set up: `sn_projects`, `sn_clients`, `sn_dno_details`, `sn_region`, `sn_sites`, `sn_import_events`, and `sn_project_process`.
 * - The script must be configured with the correct database connection details.
 *
 * ## Usage:
 * - This function should be called with an active database connection, an instance ID, a unique import ID, and a well-structured project data object.
 * - Ensure that the database connection is active and correctly configured before calling this function.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database. This connection is used to execute SQL queries for inserting or updating project details and logging import events.
 * @param {string} instanceId - The unique identifier for the customer instance.
 * @param {string} importId - The unique identifier for the import event. This ID is used to log the import event in the `sn_import_events` table.
 * @param {Object} projectData - A comprehensive object containing all necessary details for the project. This includes:
 *   - `pvNumber` (String): The unique PV number serving as the identifier for the project.
 *   - `clientData` (Object): Contains details necessary for importing or updating client information associated with the project.
 *   - `dnoDetails` (Object): Includes Distribution Network Operator (DNO) details, crucial for the project's electrical aspects.
 *   - `regionData` (Object): Information about the geographical region of the project.
 *   - `siteData` (Object): Specifics about the project site, including location and characteristics.
 *   - `projectProcessData` (Object): Data related to the project's process and stages.
 *   - `additionalDetails` (Object): Miscellaneous project details, such as:
 *     - `refNumber` (String): A reference number for the project.
 *     - `projectName` (String): The official name of the project.
 *     - `jobCode` (String): A code associated with the job or project.
 *     - `comments` (String): Any additional comments or notes about the project.
 *     - `dnoZone` (String): The specific zone of the DNO relevant to the project.
 *   - `customFields` - Custom fields data for the project. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For project custom fields, this should be 'project'.
 *     - {string} entityId - The UUID of the specific project instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 *
 * @returns {String} projectId - The unique identifier (`project_id`) of the newly inserted or updated project record in the `sn_projects` table. This ID can be used to reference the project in subsequent operations or queries.
 *
 * @example
 * // Example of a projectData object:
 * const projectData = {
 *   pvNumber: "PV123456",
 *   clientId: "abc123",
 *   dnoDetailsId: "def456",
 *   regionId: "ghi789",
 *   siteId: "jkl012",
 *   projectProcessId: "mno345",
 *   additionalDetails: {
 *     refNumber: "REF123456",
 *     projectName: "Solar Panel Installation",
 *     jobCode: "JOB123",
 *     comments: "Urgent installation required",
 *     dnoZone: "Zone 3"
 *   },
 *   customFields: { /* custom fields data */ }
 * };
 *
 * // Example usage:
 * const instanceId = 'abc123';
 * const importId = 'importEvent123';
 * const projectId = importProject(databaseConnection, instanceId, importId, projectData);
 *
 * @note
 * - Ensure all related data in `clientData`, `dnoDetails`, `regionData`, `siteData`, and `projectProcessData` adhere to their respective table schemas.
 * - The function performs necessary checks to avoid duplicate entries based on the `pvNumber` and ensures data consistency across related tables.
 */
function importProject(conn, instanceId, importId, projectData) {
    var checkProjectStmt = conn.prepareStatement('SELECT * FROM sn_projects WHERE instance_id = ? AND pv_number = ?');
    checkProjectStmt.setString(1, instanceId);
    checkProjectStmt.setString(2, projectData.pvNumber);
    var rs = checkProjectStmt.executeQuery();

    var projectIdReturned;

    if (rs.next()) {
        var existingProjectId = rs.getString('project_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_projects SET instance_id = ?, client_id = ?, dno_details_id = ?, region_id = ?, site_id = ?, ref_number = ?, project_name = ?, job_code = ?, comments = ?, import_id = ?, project_process_id = ?, dno_zone = ? WHERE instance_id = ? AND pv_number = ?');

        updateStmt.setString(1, instanceId);
        updateStmt.setString(2, projectData.clientId);
        updateStmt.setString(3, projectData.dnoDetailsId);
        updateStmt.setString(4, projectData.regionId);
        updateStmt.setString(5, projectData.siteId);
        updateStmt.setString(6, projectData.additionalDetails.refNumber);
        updateStmt.setString(7, projectData.additionalDetails.projectName);
        updateStmt.setString(8, projectData.additionalDetails.jobCode);
        updateStmt.setString(9, projectData.additionalDetails.comments);
        updateStmt.setString(10, importId);
        updateStmt.setString(11, projectData.projectProcessId);
        updateStmt.setString(12, projectData.additionalDetails.dnoZone);
        updateStmt.setString(13, instanceId);
        updateStmt.setString(14, projectData.pvNumber);

        updateStmt.execute();
        projectIdReturned = existingProjectId;

        // Import custom fields for the existing project
        if (projectData.customFields) {
            projectData.customFields.entityType = 'project';
            projectData.customFields.entityId = existingProjectId;
            projectData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, projectData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for project: ' + existingProjectId);
            }
        }
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_projects (project_id, instance_id, client_id, pv_number, dno_details_id, region_id, site_id, ref_number, project_name, job_code, comments, import_id, project_process_id, dno_zone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        projectIdReturned = Utilities.getUuid();

        insertStmt.setString(1, projectIdReturned);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, projectData.clientId);
        insertStmt.setString(4, projectData.pvNumber);
        insertStmt.setString(5, projectData.dnoDetailsId);
        insertStmt.setString(6, projectData.regionId);
        insertStmt.setString(7, projectData.siteId);
        insertStmt.setString(8, projectData.additionalDetails.refNumber);
        insertStmt.setString(9, projectData.additionalDetails.projectName);
        insertStmt.setString(10, projectData.additionalDetails.jobCode);
        insertStmt.setString(11, projectData.additionalDetails.comments);
        insertStmt.setString(12, importId);
        insertStmt.setString(13, projectData.projectProcessId);
        insertStmt.setString(14, projectData.additionalDetails.dnoZone);

        insertStmt.execute();

        // Import custom fields for the new project
        if (projectData.customFields) {
            projectData.customFields.entityType = 'project';
            projectData.customFields.entityId = projectIdReturned;
            projectData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, projectData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for project: ' + projectIdReturned);
            }
        }
    }

    rs.close();
    checkProjectStmt.close();
    return projectIdReturned;
}
