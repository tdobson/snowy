/**
 * Imports project details into the sn_projects table in the database. The function either inserts a new record or updates
 * an existing one based on the provided project data object. An import event is logged in the sn_import_events table
 * each time the function is run.
 *
 * Prerequisites:
 * - The database should have sn_projects, sn_clients, sn_dno_details, sn_region, sn_sites, sn_import_events, and sn_project_process tables set up.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Call this function with a database connection and a project data object to import project data.
 * - Ensure the database connection details are correctly set.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {Object} projectData - Object containing all necessary project details:
 *   {
 *     pvNumber: String, // PV number, unique identifier for the project.
 *     clientData: Object, // Data object for importing/updating client details.
 *     dnoDetails: Object, // Data object for DNO details.
 *     regionData: Object, // Data object for region details.
 *     siteData: Object, // Data object for site details.
 *     projectProcessData: Object, // Data object for project process details.
 *     additionalDetails: {
 *       refNumber: String,
 *       projectName: String,
 *       jobCode: String,
 *       comments: String,
 *       dnoZone: String
 *     }
 *   }
 * @returns {String} The project_id of the inserted, updated, or existing project record.
 */
function importProjectDetails(conn, projectData) {
    var importId = insertImportEvent(conn, '', 'Project Import', 'Importing project details', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

    var checkProjectStmt = conn.prepareStatement('SELECT * FROM sn_projects WHERE pv_number = ?');
    checkProjectStmt.setString(1, projectData.pvNumber);
    var rs = checkProjectStmt.executeQuery();

    var clientId = importUserData(projectData.clientData, importId, conn);
    var dnoDetailsId = lookupDnoDetailsByMpan(projectData.dnoDetails.mpanId);
    var regionId = getRegionIdFromRegionNumber(projectData.regionData.regionNumber);
    var siteId = importSiteData(projectData.siteData, conn);
    var projectProcessId = importProjectProcess(conn, projectData.projectProcessData);

    var projectIdReturned;

    if (rs.next()) {
        var existingProjectId = rs.getString('project_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_projects SET client_id = ?, dno_details_id = ?, region_id = ?, site_id = ?, ref_number = ?, project_name = ?, job_code = ?, comments = ?, import_id = ?, project_process_id = ?, dno_zone = ? WHERE pv_number = ?');

        updateStmt.setString(1, clientId);
        updateStmt.setString(2, dnoDetailsId);
        updateStmt.setString(3, regionId);
        updateStmt.setString(4, siteId);
        updateStmt.setString(5, projectData.additionalDetails.refNumber);
        updateStmt.setString(6, projectData.additionalDetails.projectName);
        updateStmt.setString(7, projectData.additionalDetails.jobCode);
        updateStmt.setString(8, projectData.additionalDetails.comments);
        updateStmt.setString(9, importId);
        updateStmt.setString(10, projectProcessId);
        updateStmt.setString(11, projectData.additionalDetails.dnoZone);
        updateStmt.setString(12, projectData.pvNumber);

        updateStmt.execute();
        projectIdReturned = existingProjectId;
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_projects (project_id, client_id, pv_number, dno_details_id, region_id, site_id, ref_number, project_name, job_code, comments, import_id, project_process_id, dno_zone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        var newProjectId = Utilities.getUuid();

        insertStmt.setString(1, newProjectId);
        insertStmt.setString(2, clientId);
        insertStmt.setString(3, projectData.pvNumber);
          insertStmt.setString(4, dnoDetailsId);
          insertStmt.setString(5, regionId);
          insertStmt.setString(6, siteId);
          insertStmt.setString(7, projectData.additionalDetails.refNumber);
          insertStmt.setString(8, projectData.additionalDetails.projectName);
          insertStmt.setString(9, projectData.additionalDetails.jobCode);
          insertStmt.setString(10, projectData.additionalDetails.comments);
          insertStmt.setString(11, importId);
          insertStmt.setString(12, projectProcessId);
          insertStmt.setString(13, projectData.additionalDetails.dnoZone);
              insertStmt.execute();
              projectIdReturned = newProjectId;
          }

          rs.close();
          checkProjectStmt.close();
          return projectIdReturned;
}
