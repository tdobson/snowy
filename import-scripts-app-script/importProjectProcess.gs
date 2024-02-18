/**
 * Imports project process details into the sn_project_process table in the database. This function either
 * inserts a new record or updates an existing one based on the provided project process data.
 * An import event ID is generated and logged each time the function is run.
 *
 * Prerequisites:
 * - The database should have sn_project_process and sn_import_events tables set up.
 *
 * Usage:
 * - This function is called with a database connection and project process data object.
 * - Ensure the database connection details are correctly set.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {Object} projectProcessData - Object containing project process details. Expected keys:
 *   - {string} project_process_id - Unique identifier for the project process (required).
 *   - {string} approval_status - Current status of the approval (required).
 *   - {Date} deadline_to_connect - Deadline for the project to establish a connection.
 *   - {boolean} auth_letter_sent - Indicates if the letter of authority has been sent.
 *   - {boolean} mpan_request_sent - Indicates if the MPAN request has been sent.
 *   - {boolean} schematic_created - Indicates if the project's schematic has been created.
 *   - {string} application_type - Type of application for the project.
 *   - {boolean} formal_dno_submitted - Indicates if the formal DNO submission has been made.
 *   - {Date} submission_date - Date of paperwork submission.
 *   - {Date} dno_due_date - Due date for the DNO to respond.
 *   - {string} dno_status - Current DNO approval status.
 *   - {float} approved_kwp - Kilowatt-peak approved by the DNO.
 *   - {boolean} quote_received - Indicates if a quote has been received.
 *   - {Date} customer_invoiced_date - Date the customer was invoiced.
 *   - {Date} dno_payment_made - Date payment was made to the DNO.
 *   - {boolean} acceptance_form_returned - Indicates if the acceptance form has been returned.
 *   - {Date} date_approved - Date of project approval.
 * @returns {String} The project_process_id of the inserted, updated, or existing project process record.
 */
function importProjectProcess(conn, importId, projectProcessData) {
    var checkProcessStmt = conn.prepareStatement('SELECT * FROM sn_project_process WHERE project_process_id = ?');
    var insertProcessStmt = conn.prepareStatement('INSERT INTO sn_project_process (project_process_id, approval_status, deadline_to_connect, auth_letter_sent, mpan_request_sent, schematic_created, application_type, formal_dno_submitted, submission_date, dno_due_date, dno_status, approved_kwp, quote_received, customer_invoiced_date, dno_payment_made, acceptance_form_returned, date_approved, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    var updateProcessStmt = conn.prepareStatement('UPDATE sn_project_process SET approval_status = ?, deadline_to_connect = ?, auth_letter_sent = ?, mpan_request_sent = ?, schematic_created = ?, application_type = ?, formal_dno_submitted = ?, submission_date = ?, dno_due_date = ?, dno_status = ?, approved_kwp = ?, quote_received = ?, customer_invoiced_date = ?, dno_payment_made = ?, acceptance_form_returned = ?, date_approved = ? WHERE project_process_id = ?');

    var projectProcessIdReturned;

    var approvalStatusId = importStatus({ status_state: projectProcessData.approval_status, status_group: "Approval Status Group" }, conn);
    var dnoStatusId = importStatus({ status_state: projectProcessData.dno_status, status_group: "DNO Status Group" }, conn);

    checkProcessStmt.setString(1, projectProcessData.project_process_id);
    var processResult = checkProcessStmt.executeQuery();
    if (processResult.next()) {
        // Update existing project process
        updateProcessStmt.setString(1, approvalStatusId);
        updateProcessStmt.setDate(2, projectProcessData.deadline_to_connect);
        updateProcessStmt.setBoolean(3, projectProcessData.auth_letter_sent);
        updateProcessStmt.setBoolean(4, projectProcessData.mpan_request_sent);
        updateProcessStmt.setBoolean(5, projectProcessData.schematic_created);
        updateProcessStmt.setString(6, projectProcessData.application_type);
        updateProcessStmt.setBoolean(7, projectProcessData.formal_dno_submitted);
        updateProcessStmt.setDate(8, projectProcessData.submission_date);
        updateProcessStmt.setDate(9, projectProcessData.dno_due_date);
        updateProcessStmt.setString(10, dnoStatusId);
        updateProcessStmt.setFloat(11, projectProcessData.approved_kwp);
        updateProcessStmt.setBoolean(12, projectProcessData.quote_received);
        updateProcessStmt.setDate(13, projectProcessData.customer_invoiced_date);
        updateProcessStmt.setDate(14, projectProcessData.dno_payment_made);
        updateProcessStmt.setBoolean(15, projectProcessData.acceptance_form_returned);
        updateProcessStmt.setDate(16, projectProcessData.date_approved);
        updateProcessStmt.setString(17, projectProcessData.project_process_id);
        updateProcessStmt.execute();
    projectProcessIdReturned = projectProcessData.project_process_id;
} else {
    // Insert new project process
    var projectProcessUuid = Utilities.getUuid();
    insertProcessStmt.setString(1, projectProcessUuid);
    insertProcessStmt.setString(2, approvalStatusId);
    insertProcessStmt.setDate(3, projectProcessData.deadline_to_connect);
    insertProcessStmt.setBoolean(4, projectProcessData.auth_letter_sent);
    insertProcessStmt.setBoolean(5, projectProcessData.mpan_request_sent);
    insertProcessStmt.setBoolean(6, projectProcessData.schematic_created);
    insertProcessStmt.setString(7, projectProcessData.application_type);
    insertProcessStmt.setBoolean(8, projectProcessData.formal_dno_submitted);
    insertProcessStmt.setDate(9, projectProcessData.submission_date);
    insertProcessStmt.setDate(10, projectProcessData.dno_due_date);
    insertProcessStmt.setString(11, dnoStatusId);
    insertProcessStmt.setFloat(12, projectProcessData.approved_kwp);
    insertProcessStmt.setBoolean(13, projectProcessData.quote_received);
    insertProcessStmt.setDate(14, projectProcessData.customer_invoiced_date);
    insertProcessStmt.setDate(15, projectProcessData.dno_payment_made);
    insertProcessStmt.setBoolean(16, projectProcessData.acceptance_form_returned);
    insertProcessStmt.setDate(17, projectProcessData.date_approved);
    insertProcessStmt.setString(18, importId);
    insertProcessStmt.execute();

    projectProcessIdReturned = projectProcessUuid;
}

// Returning the project process ID
return projectProcessIdReturned;
}

