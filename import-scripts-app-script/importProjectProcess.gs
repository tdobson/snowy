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
 *   - customFields - Custom fields data for the project process. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For project process custom fields, this should be 'projectProcess'.
 *     - {string} entityId - The UUID of the specific project process instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 * @returns {String} The project_process_id of the inserted, updated, or existing project process record.
 */
function importProjectProcess(conn, importId, projectProcessData) {
    var checkProcessStmt = conn.prepareStatement('SELECT * FROM sn_project_process WHERE project_process_id = ?');
    var insertProcessStmt = conn.prepareStatement('INSERT INTO sn_project_process (project_process_id, approval_status, deadline_to_connect, auth_letter_sent, mpan_request_sent, schematic_created, application_type, formal_dno_submitted, submission_date, dno_due_date, dno_status, approved_kwp, quote_received, customer_invoiced_date, dno_payment_made, acceptance_form_returned, date_approved, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    var updateProcessStmt = conn.prepareStatement('UPDATE sn_project_process SET approval_status = ?, deadline_to_connect = ?, auth_letter_sent = ?, mpan_request_sent = ?, schematic_created = ?, application_type = ?, formal_dno_submitted = ?, submission_date = ?, dno_due_date = ?, dno_status = ?, approved_kwp = ?, quote_received = ?, customer_invoiced_date = ?, dno_payment_made = ?, acceptance_form_returned = ?, date_approved = ? WHERE project_process_id = ?');

    var projectProcessIdReturned;

    var approvalStatusId = importStatus(conn, importId, { status_state: projectProcessData.approval_status, status_group: "Approval Status Group" });
    var dnoStatusId = importStatus(conn, importId, { status_state: projectProcessData.dno_status, status_group: "DNO Status Group" });

    checkProcessStmt.setString(1, projectProcessData.project_process_id);
    var processResult = checkProcessStmt.executeQuery();

    if (processResult.next()) {
        // Update existing project process
        updateProcessStmt.setString(1, approvalStatusId);

        // Sanitize and set deadline_to_connect
        var sanitizedDeadline = sanitizeDateForSql(projectProcessData.deadline_to_connect);
        if (sanitizedDeadline) {
            updateProcessStmt.setString(2, sanitizedDeadline);
        } else {
            updateProcessStmt.setNull(2, 0);
        }

        updateProcessStmt.setBoolean(3, projectProcessData.auth_letter_sent);
        updateProcessStmt.setBoolean(4, projectProcessData.mpan_request_sent);
        updateProcessStmt.setBoolean(5, projectProcessData.schematic_created);
        updateProcessStmt.setString(6, projectProcessData.application_type);
        updateProcessStmt.setBoolean(7, projectProcessData.formal_dno_submitted);

        // Sanitize and set submission_date
        var sanitizedSubmissionDate = sanitizeDateForSql(projectProcessData.submission_date);
        if (sanitizedSubmissionDate) {
            updateProcessStmt.setString(8, sanitizedSubmissionDate);
        } else {
            updateProcessStmt.setNull(8, 0);
        }

        // Sanitize and set dno_due_date
        var sanitizedDnoDueDate = sanitizeDateForSql(projectProcessData.dno_due_date);
        if (sanitizedDnoDueDate) {
            updateProcessStmt.setString(9, sanitizedDnoDueDate);
        } else {
            updateProcessStmt.setNull(9, 0);
        }

        updateProcessStmt.setString(10, dnoStatusId);
        updateProcessStmt.setFloat(11, projectProcessData.approved_kwp);
        updateProcessStmt.setBoolean(12, projectProcessData.quote_received);

        // Sanitize and set customer_invoiced_date
        var sanitizedCustomerInvoicedDate = sanitizeDateForSql(projectProcessData.customer_invoiced_date);
        if (sanitizedCustomerInvoicedDate) {
            updateProcessStmt.setString(13, sanitizedCustomerInvoicedDate);
        } else {
            updateProcessStmt.setNull(13, 0);
        }

        // Sanitize and set dno_payment_made
        var sanitizedDnoPaymentMade = sanitizeDateForSql(projectProcessData.dno_payment_made);
        if (sanitizedDnoPaymentMade) {
            updateProcessStmt.setString(14, sanitizedDnoPaymentMade);
        } else {
            updateProcessStmt.setNull(14, 0);
        }

        updateProcessStmt.setBoolean(15, projectProcessData.acceptance_form_returned);

        // Sanitize and set date_approved
        var sanitizedDateApproved = sanitizeDateForSql(projectProcessData.date_approved);
        if (sanitizedDateApproved) {
            updateProcessStmt.setString(16, sanitizedDateApproved);
        } else {
            updateProcessStmt.setNull(16, 0);
        }

        updateProcessStmt.setString(17, projectProcessData.project_process_id);
        updateProcessStmt.execute();
        projectProcessIdReturned = projectProcessData.project_process_id;

        // Import custom fields for the existing project process
        if (projectProcessData.customFields) {
            projectProcessData.customFields.entityType = 'projectProcess';
            projectProcessData.customFields.entityId = projectProcessData.project_process_id;
            var customFieldsImported = importCustomFields(conn, importId, projectProcessData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for project process: ' + projectProcessData.project_process_id);
            }
        }
    } else {
        // Insert new project process
        var projectProcessUuid = Utilities.getUuid();
        insertProcessStmt.setString(1, projectProcessUuid);
        insertProcessStmt.setString(2, approvalStatusId);

        // Sanitize and set deadline_to_connect for insert
        var insertSanitizedDeadline = sanitizeDateForSql(projectProcessData.deadline_to_connect);
        if (insertSanitizedDeadline) {
            insertProcessStmt.setString(3, insertSanitizedDeadline);
        } else {
            insertProcessStmt.setNull(3, 0);
        }

        insertProcessStmt.setBoolean(4, projectProcessData.auth_letter_sent);
        insertProcessStmt.setBoolean(5, projectProcessData.mpan_request_sent);
        insertProcessStmt.setBoolean(6, projectProcessData.schematic_created);
        insertProcessStmt.setString(7, projectProcessData.application_type);
        insertProcessStmt.setBoolean(8, projectProcessData.formal_dno_submitted);

        // Sanitize and set submission_date for insert
        var insertSanitizedSubmissionDate = sanitizeDateForSql(projectProcessData.submission_date);
        if (insertSanitizedSubmissionDate) {
            insertProcessStmt.setString(9, insertSanitizedSubmissionDate);
        } else {
            insertProcessStmt.setNull(9, 0);
        }

        // Sanitize and set dno_due_date for insert
        var insertSanitizedDnoDueDate = sanitizeDateForSql(projectProcessData.dno_due_date);
        if (insertSanitizedDnoDueDate) {
            insertProcessStmt.setString(10, insertSanitizedDnoDueDate);
        } else {
            insertProcessStmt.setNull(10, 0);
        }

        insertProcessStmt.setString(11, dnoStatusId);
        insertProcessStmt.setFloat(12, projectProcessData.approved_kwp);
        insertProcessStmt.setBoolean(13, projectProcessData.quote_received);

        // Sanitize and set customer_invoiced_date for insert
        var insertSanitizedCustomerInvoicedDate = sanitizeDateForSql(projectProcessData.customer_invoiced_date);
        if (insertSanitizedCustomerInvoicedDate) {
            insertProcessStmt.setString(14, insertSanitizedCustomerInvoicedDate);
        } else {
            insertProcessStmt.setNull(14, 0);
        }

        // Sanitize and set dno_payment_made for insert
        var insertSanitizedDnoPaymentMade = sanitizeDateForSql(projectProcessData.dno_payment_made);
        if (insertSanitizedDnoPaymentMade) {
            insertProcessStmt.setString(15, insertSanitizedDnoPaymentMade);
        } else {
            insertProcessStmt.setNull(15, 0);
        }

        insertProcessStmt.setBoolean(16, projectProcessData.acceptance_form_returned);

        // Sanitize and set date_approved for insert
        var insertSanitizedDateApproved = sanitizeDateForSql(projectProcessData.date_approved);
        if (insertSanitizedDateApproved) {
            insertProcessStmt.setString(17, insertSanitizedDateApproved);
        } else {
            insertProcessStmt.setNull(17, 0);
        }

        insertProcessStmt.setString(18, importId);
        insertProcessStmt.execute();

        projectProcessIdReturned = projectProcessUuid;

        // Import custom fields for the new project process
        if (projectProcessData.customFields) {
            projectProcessData.customFields.entityType = 'projectProcess';
            projectProcessData.customFields.entityId = projectProcessUuid;
            var customFieldsImported = importCustomFields(conn, importId, projectProcessData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for project process: ' + projectProcessUuid);
            }
        }
    }

    // Returning the project process ID
    return projectProcessIdReturned;
}
