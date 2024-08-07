/**
 * Imports job data into a MySQL database. It updates existing job records or inserts new ones.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} importId - The ID of the current import session.
 * @param {Object} jobData - An object containing the job's details.
 *
 * @returns {string} The UUID of the existing or new job.
 */
function importJobData(conn, instanceId, importId, jobData) {
    if (!jobData.projectNumber || !instanceId) {
        console.log("Project Number is required.");
        return null;
    }

    var checkJobStmt = conn.prepareStatement('SELECT * FROM sn_jobs WHERE instance_id = ? AND project_id = ? AND plot_id = ?');
    checkJobStmt.setString(1, instanceId);
    checkJobStmt.setString(2, jobData.projectNumber);
    checkJobStmt.setString(3, jobData.plotNumber);
    var rs = checkJobStmt.executeQuery();
    var jobId;

    if (rs.next()) {
        jobId = rs.getString('job_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_jobs SET job_type = ?, user_id = ?, job_status = ?, dispatch_id = ?, submission_id = ?, dispatched_at = ?, dispatched_by = ?, returned_at = ?, returned_by = ?, dispatch_team = ?, import_id = ? WHERE job_id = ?');

        updateStmt.setString(1, jobData.jobType);
        updateStmt.setString(2, jobData.installer);
        updateStmt.setString(3, jobData.completed ? 'Completed' : 'Pending');
        updateStmt.setString(4, jobData.dispatchId);
        updateStmt.setString(5, jobData.eventId);
        updateStmt.setDate(6, new Date());
        updateStmt.setString(7, ''); // Set dispatched_by if available
        updateStmt.setDate(8, jobData.dateCompleted ? new Date(jobData.dateCompleted) : null);
        updateStmt.setString(9, jobData.installer);
        updateStmt.setString(10, ''); // Set dispatch_team if available
        updateStmt.setString(11, importId);
        updateStmt.setString(12, jobId);

        updateStmt.execute();
        console.log("Job data updated for project: " + jobData.projectNumber);
    } else {
        jobId = Utilities.getUuid();
        var insertStmt = conn.prepareStatement('INSERT INTO sn_jobs (job_id, instance_id, plot_id, project_id, user_id, job_type, job_status, dispatch_id, submission_id, dispatched_at, dispatched_by, returned_at, returned_by, dispatch_team, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, jobId);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, jobData.plotNumber);
        insertStmt.setString(4, jobData.projectNumber);
        insertStmt.setString(5, jobData.installer);
        insertStmt.setString(6, jobData.jobType);
        insertStmt.setString(7, jobData.completed ? 'Completed' : 'Pending');
        insertStmt.setString(8, jobData.dispatchId);
        insertStmt.setString(9, jobData.eventId);
        insertStmt.setDate(10, new Date());
        insertStmt.setString(11, ''); // Set dispatched_by if available
        insertStmt.setDate(12, jobData.dateCompleted ? new Date(jobData.dateCompleted) : null);
        insertStmt.setString(13, jobData.installer);
        insertStmt.setString(14, ''); // Set dispatch_team if available
        insertStmt.setString(15, importId);

        insertStmt.execute();
        console.log("New job inserted for project: " + jobData.projectNumber);
    }

    rs.close();
    checkJobStmt.close();

    return jobId;
}
