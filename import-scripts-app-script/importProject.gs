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
 * - This function should be called with an active database connection and a well-structured project data object.
 * - Ensure that the database connection is active and correctly configured before calling this function.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database. This connection is used to execute SQL queries for inserting or updating project details and logging import events.
 *
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
 *
 * @param {String} importId - The unique identifier for the import event. This ID is used to log the import event in the `sn_import_events` table.
 *
 * @returns {String} projectId - The unique identifier (`project_id`) of the newly inserted or updated project record in the `sn_projects` table. This ID can be used to reference the project in subsequent operations or queries.
 *
 * @example
 * // Example of a projectData object:
 * const projectData = {
 *   pvNumber: "PV123456",
 *   clientData: { /* client details *\/ },
 *   dnoDetails: { mpanId: "123456789" },
 *   regionData: { regionNumber: "01" },
 *   siteData: { /* site details *\/ },
 *   projectProcessData: { /* process details *\/ },
 *   additionalDetails: {
 *     refNumber: "REF123456",
 *     projectName: "Solar Panel Installation",
 *     jobCode: "JOB123",
 *     comments: "Urgent installation required",
 *     dnoZone: "Zone 3"
 *   }
 * };
 *
 * // Example usage:
 * const projectId = importProject(databaseConnection, projectData, "importEvent123");
 *
 * @note
 * - Ensure all related data in `clientData`, `dnoDetails`, `regionData`, `siteData`, and `projectProcessData` adhere to their respective table schemas.
 * - The function performs necessary checks to avoid duplicate entries based on the `pvNumber` and ensures data consistency across related tables.
 */
function importProject(conn, importId, projectData) {

    var checkProjectStmt = conn.prepareStatement('SELECT * FROM sn_projects WHERE pv_number = ?');
    checkProjectStmt.setString(1, projectData.pvNumber);
    var rs = checkProjectStmt.executeQuery();

    var projectIdReturned;

    if (rs.next()) {
        var existingProjectId = rs.getString('project_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_projects SET client_id = ?, dno_details_id = ?, region_id = ?, site_id = ?, ref_number = ?, project_name = ?, job_code = ?, comments = ?, import_id = ?, project_process_id = ?, dno_zone = ? WHERE pv_number = ?');

        updateStmt.setString(1, projectData.clientId);
        updateStmt.setString(2, projectData.dnoDetailsId);
        updateStmt.setString(3, projectData.regionId);
        updateStmt.setString(4, projectData.siteId);
        updateStmt.setString(5, projectData.additionalDetails.refNumber);
        updateStmt.setString(6, projectData.additionalDetails.projectName);
        updateStmt.setString(7, projectData.additionalDetails.jobCode);
        updateStmt.setString(8, projectData.additionalDetails.comments);
        updateStmt.setString(9, importId);
        updateStmt.setString(10, projectData.projectProcessId);
        updateStmt.setString(11, projectData.additionalDetails.dnoZone);
        updateStmt.setString(12, projectData.pvNumber);

        updateStmt.execute();
        projectIdReturned = existingProjectId;
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_projects (project_id, client_id, pv_number, dno_details_id, region_id, site_id, ref_number, project_name, job_code, comments, import_id, project_process_id, dno_zone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        projectIdReturned = Utilities.getUuid();

        insertStmt.setString(1, newProjectId);
        insertStmt.setString(2, projectData.clientId);
        insertStmt.setString(3, projectData.pvNumber);
          insertStmt.setString(4, projectData.dnoDetailsId);
          insertStmt.setString(5, projectData.regionId);
          insertStmt.setString(6, projectData.siteId);
          insertStmt.setString(7, projectData.additionalDetails.refNumber);
          insertStmt.setString(8, projectData.additionalDetails.projectName);
          insertStmt.setString(9, projectData.additionalDetails.jobCode);
          insertStmt.setString(10, projectData.additionalDetails.comments);
          insertStmt.setString(11, importId);
          insertStmt.setString(12, projectData.projectProcessId);
          insertStmt.setString(13, projectData.additionalDetails.dnoZone);
              insertStmt.execute();
          }

          rs.close();
          checkProjectStmt.close();
          return projectIdReturned;
}
