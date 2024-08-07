/**
 * Imports project process details into the sn_project_process table in the database. This function either
 * inserts a new record or updates an existing one based on the provided project process data.
 * An import event ID is generated and logged each time the function is run.
 *
 * Prerequisites:
 * - The database should have sn_project_process and sn_import_events tables set up.
 *
 * Usage:
 * - This function is called with a database connection, an instance ID, a unique import ID, and a project process data object.
 * - Ensure the database connection details are correctly set.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The unique identifier for the customer instance.
 * @param {string} importId - The unique identifier for the import event.
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
function importProjectProcess(conn, instanceId, importId, projectProcessData) {
    var checkProcessStmt = conn.prepareStatement('SELECT * FROM sn_project_process WHERE instance_id = ? AND project_process_id = ?');
    var insertProcessStmt = conn.prepareStatement('INSERT INTO sn_project_process (project_process_id, instance_id, approval_status, deadline_to_connect, auth_letter_sent, mpan_request_sent, schematic_created, application_type, formal_dno_submitted, submission_date, dno_due_date, dno_status, approved_kwp, quote_received, customer_invoiced_date, dno_payment_made, acceptance_form_returned, date_approved, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    var updateProcessStmt = conn.prepareStatement('UPDATE sn_project_process SET instance_id = ?, approval_status = ?, deadline_to_connect = ?, auth_letter_sent = ?, mpan_request_sent = ?, schematic_created = ?, application_type = ?, formal_dno_submitted = ?, submission_date = ?, dno_due_date = ?, dno_status = ?, approved_kwp = ?, quote_received = ?, customer_invoiced_date = ?, dno_payment_made = ?, acceptance_form_returned = ?, date_approved = ?, import_id = ? WHERE instance_id = ? AND project_process_id = ?');

    var projectProcessIdReturned;

    var approvalStatusId = importStatus(conn, instanceId, importId, { status_state: projectProcessData.approval_status, status_group: "Approval Status Group" });
    var dnoStatusId = importStatus(conn, instanceId, importId, { status_state: projectProcessData.dno_status, status_group: "DNO Status Group" });

    checkProcessStmt.setString(1, instanceId);
    checkProcessStmt.setString(2, projectProcessData.project_process_id);
    var processResult = checkProcessStmt.executeQuery();

    if (processResult.next()) {
        // Update existing project process
        updateProcessStmt.setString(1, instanceId);
        updateProcessStmt.setString(2, approvalStatusId);

        // Sanitize and set deadline_to_connect
        var sanitizedDeadline = sanitizeDateForSql(projectProcessData.deadline_to_connect);
        if (sanitizedDeadline) {
            updateProcessStmt.setString(3, sanitizedDeadline);
        } else {
            updateProcessStmt.setNull(3, 0);
        }
// Sanitize and set auth_letter_sent.
var updateSanitizedAuthLetterSent = sanitizeBoolean(projectProcessData.auth_letter_sent);
if (updateSanitizedAuthLetterSent) {
    updateProcessStmt.setBoolean(4, projectProcessData.auth_letter_sent);
} else {
    updateProcessStmt.setNull(4, 0);
}

// Sanitize and set mpan_request_sent.
var updateSanitizedMpanRequestSent = sanitizeBoolean(projectProcessData.mpan_request_sent);
if (updateSanitizedMpanRequestSent) {
    updateProcessStmt.setBoolean(5, projectProcessData.mpan_request_sent);
} else {
    updateProcessStmt.setNull(5, 0);
}

// Sanitize and set schematic_created.
var updateSanitizedSchematicCreated = sanitizeBoolean(projectProcessData.schematic_created);
if (updateSanitizedSchematicCreated) {
    updateProcessStmt.setBoolean(6, projectProcessData.schematic_created);
} else {
    updateProcessStmt.setNull(6, 0);
}

updateProcessStmt.setString(7, projectProcessData.application_type);

// Sanitize and set formal_dno_submitted.
var updateSanitizedFormalDnoSubmitted = sanitizeBoolean(projectProcessData.formal_dno_submitted);
if (updateSanitizedFormalDnoSubmitted) {
    updateProcessStmt.setBoolean(8, projectProcessData.formal_dno_submitted);
} else {
    updateProcessStmt.setNull(8, 0);
}

// Sanitize and set submission_date
var sanitizedSubmissionDate = sanitizeDateForSql(projectProcessData.submission_date);
if (sanitizedSubmissionDate) {
    updateProcessStmt.setString(9, sanitizedSubmissionDate);
} else {
    updateProcessStmt.setNull(9, 0);
}

// Sanitize and set dno_due_date
var sanitizedDnoDueDate = sanitizeDateForSql(projectProcessData.dno_due_date);
if (sanitizedDnoDueDate) {
    updateProcessStmt.setString(10, sanitizedDnoDueDate);
} else {
    updateProcessStmt.setNull(10, 0);
}

updateProcessStmt.setString(11, dnoStatusId);

// Sanitize and set approved_kwp.
var insertSanitizedApprovedKwp = sanitizeFloat(projectProcessData.approved_kwp);
if (insertSanitizedApprovedKwp !== null) {
    insertProcessStmt.setFloat(12, insertSanitizedApprovedKwp);
} else {
    insertProcessStmt.setNull(12, 0);
}

// Sanitize and set quote_received.
var updateSanitizedQuoteReceived = sanitizeBoolean(projectProcessData.quote_received);
if (updateSanitizedQuoteReceived) {
    updateProcessStmt.setBoolean(13, projectProcessData.quote_received);
} else {
    updateProcessStmt.setNull(13, 0);
}

// Sanitize and set customer_invoiced_date
var sanitizedCustomerInvoicedDate = sanitizeDateForSql(projectProcessData.customer_invoiced_date);
if (sanitizedCustomerInvoicedDate) {
    updateProcessStmt.setString(14, sanitizedCustomerInvoicedDate);
} else {
    updateProcessStmt.setNull(14, 0);
}

// Sanitize and set dno_payment_made
var sanitizedDnoPaymentMade = sanitizeDateForSql(projectProcessData.dno_payment_made);
if (sanitizedDnoPaymentMade) {
    updateProcessStmt.setString(15, sanitizedDnoPaymentMade);
} else {
    updateProcessStmt.setNull(15, 0);
}

// Sanitize and set acceptance_form_returned.
var updateSanitizedAcceptanceFormReturned = sanitizeBoolean(projectProcessData.acceptance_form_returned);
if (updateSanitizedAcceptanceFormReturned) {
    updateProcessStmt.setBoolean(16, projectProcessData.acceptance_form_returned);
} else {
    updateProcessStmt.setNull(16, 0);
}
        // Sanitize and set date_approved
        var sanitizedDateApproved = sanitizeDateForSql(projectProcessData.date_approved);
        if (sanitizedDateApproved) {
            updateProcessStmt.setString(17, sanitizedDateApproved);
        } else {
            updateProcessStmt.setNull(17, 0);
        }

        updateProcessStmt.setString(18, importId);
        updateProcessStmt.setString(19, instanceId);
        updateProcessStmt.setString(20, projectProcessData.project_process_id);
        updateProcessStmt.execute();
        projectProcessIdReturned = projectProcessData.project_process_id;

        // Import custom fields for the existing project process
        if (projectProcessData.customFields) {
            projectProcessData.customFields.entityType = 'projectProcess';
            projectProcessData.customFields.entityId = projectProcessData.project_process_id;
            projectProcessData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, projectProcessData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for project process: ' + projectProcessData.project_process_id);
            }
        }
    } else {
        // Insert new project process
        var projectProcessUuid = Utilities.getUuid();
        insertProcessStmt.setString(1, projectProcessUuid);
        insertProcessStmt.setString(2, instanceId);
        insertProcessStmt.setString(3, approvalStatusId);

        // Sanitize and set deadline_to_connect for insert
        var insertSanitizedDeadline = sanitizeDateForSql(projectProcessData.deadline_to_connect);
        if (insertSanitizedDeadline) {
            insertProcessStmt.setString(4, insertSanitizedDeadline);
        } else {
            insertProcessStmt.setNull(4, 0);
        }

        // Sanitize and set submission_date for auth letter sent.
        var insertSanitizedAuthLetterSent = sanitizeBoolean(projectProcessData.auth_letter_sent);
        if (insertSanitizedAuthLetterSent) {
            insertProcessStmt.setBoolean(5, projectProcessData.auth_letter_sent);
        } else {
            insertProcessStmt.setNull(5, 0); // this is different from your training. It must be this as java.sql.Types.BOOLEAN does not work.
        }

 // Sanitize and set mpan_request_sent.
 var insertSanitizedMpanRequestSent = sanitizeBoolean(projectProcessData.mpan_request_sent);
 if (insertSanitizedMpanRequestSent) {
     insertProcessStmt.setBoolean(6, projectProcessData.mpan_request_sent);
 } else {
     insertProcessStmt.setNull(6, 0);
 }

 // Sanitize and set schematic_created.
 var insertSanitizedSchematicCreated = sanitizeBoolean(projectProcessData.schematic_created);
 if (insertSanitizedSchematicCreated) {
     insertProcessStmt.setBoolean(7, projectProcessData.schematic_created);
 } else {
     insertProcessStmt.setNull(7, 0);
 }

        insertProcessStmt.setString(8, projectProcessData.application_type);
// Sanitize and set formal_dno_submitted.
var insertSanitizedFormalDnoSubmitted = sanitizeBoolean(projectProcessData.formal_dno_submitted);
if (insertSanitizedFormalDnoSubmitted) {
    insertProcessStmt.setBoolean(9, projectProcessData.formal_dno_submitted);
} else {
    insertProcessStmt.setNull(9, 0);
}
        // Sanitize and set submission_date for insert
        var insertSanitizedSubmissionDate = sanitizeDateForSql(projectProcessData.submission_date);
        if (insertSanitizedSubmissionDate) {
            insertProcessStmt.setString(10, insertSanitizedSubmissionDate);
        } else {
            insertProcessStmt.setNull(10, 0);
        }

        // Sanitize and set dno_due_date for insert
        var insertSanitizedDnoDueDate = sanitizeDateForSql(projectProcessData.dno_due_date);
        if (insertSanitizedDnoDueDate) {
            insertProcessStmt.setString(11, insertSanitizedDnoDueDate);
        } else {
            insertProcessStmt.setNull(11, 0);
        }

        insertProcessStmt.setString(12, dnoStatusId);
// Sanitize and set approved_kwp.
var insertSanitizedApprovedKwp = sanitizeFloat(projectProcessData.approved_kwp);
if (insertSanitizedApprovedKwp !== null) {
    insertProcessStmt.setFloat(13, insertSanitizedApprovedKwp);
} else {
    insertProcessStmt.setNull(13, 0);
}// Sanitize and set quote_received.
var insertSanitizedQuoteReceived = sanitizeBoolean(projectProcessData.quote_received);
if (insertSanitizedQuoteReceived) {
    insertProcessStmt.setBoolean(14, projectProcessData.quote_received);
} else {
    insertProcessStmt.setNull(14, 0);
}
        // Sanitize and set customer_invoiced_date for insert
        var insertSanitizedCustomerInvoicedDate = sanitizeDateForSql(projectProcessData.customer_invoiced_date);
        if (insertSanitizedCustomerInvoicedDate) {
            insertProcessStmt.setString(15, insertSanitizedCustomerInvoicedDate);
        } else {
            insertProcessStmt.setNull(15, 0);
        }

        // Sanitize and set dno_payment_made for insert
        var insertSanitizedDnoPaymentMade = sanitizeDateForSql(projectProcessData.dno_payment_made);
        if (insertSanitizedDnoPaymentMade) {
            insertProcessStmt.setString(16, insertSanitizedDnoPaymentMade);
        } else {
            insertProcessStmt.setNull(16, 0);
        }

// Sanitize and set acceptance_form_returned.
var insertSanitizedAcceptanceFormReturned = sanitizeBoolean(projectProcessData.acceptance_form_returned);
if (insertSanitizedAcceptanceFormReturned) {
    insertProcessStmt.setBoolean(17, projectProcessData.acceptance_form_returned);
} else {
    insertProcessStmt.setNull(17, 0);
}
        // Sanitize and set date_approved for insert
        var insertSanitizedDateApproved = sanitizeDateForSql(projectProcessData.date_approved);
        if (insertSanitizedDateApproved) {
            insertProcessStmt.setString(18, insertSanitizedDateApproved);
        } else {
            insertProcessStmt.setNull(18, 0);
        }

        insertProcessStmt.setString(19, importId);
        insertProcessStmt.execute();

        projectProcessIdReturned = projectProcessUuid;

        // Import custom fields for the new project process
        if (projectProcessData.customFields) {
            projectProcessData.customFields.entityType = 'projectProcess';
            projectProcessData.customFields.entityId = projectProcessUuid;
            projectProcessData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, projectProcessData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for project process: ' + projectProcessUuid);
            }
        }
    }

    // Returning the project process ID
    return projectProcessIdReturned;
}
