/**
 * Imports or updates plot installation data into the sn_plot_install table in a database. This function
 * is designed to handle the insertion of new plot installation records or the updating of existing ones.
 * It uses various sub-functions to handle related data such as the plot's installation status, meter, and battery.
 * The function also ensures traceability by logging each import event in the sn_import_events table.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database. This connection is used
 *                                to execute SQL statements for inserting or updating data in the database.
 * @param {string} instanceId - The unique identifier for the customer instance.
 * @param {string} importId - A unique identifier for the import session.
 * @param {Object} plotInstallData - An object containing all necessary plot installation details. The structure
 *                                   is expected to match the columns of the sn_plot_install table. It should include:
 *                                   - plotInstallId: Unique identifier for the plot installation.
 *                                   - plotId: Unique identifier for the plot.
 *                                   - dateInstall: Date of installation.
 *                                   - dateChecked: Date when the installation was checked.
 *                                   - installBy: User ID of the person who installed the plot.
 *                                   - checkedBy: User ID of the person who checked the installation.
 *                                   - plotInstallStatus: Status of the plot installation.
 *                                   - phase: Phase information (1 or 3 phase).
 *                                   - p1, p2, p3: Details specific to each phase.
 *                                   - annualYield: Expected annual yield from the plot.
 *                                   - kwp: Kilowatt-peak of the plot.
 *                                   - kwpWithLimitation: Kilowatt-peak with limitations.
 *                                   - limiterRequired: Indicates if a power limiter was required.
 *                                   - limiterValueIfNotZero: Value of the limiter if not zero.
 *                                   - labourCost: Labour cost of the installation.
 *                                   - meter: Meter product ID.
 *                                   - meterCost: Cost of the meter.
 *                                   - battery: Battery product ID.
 *                                   - batteryCost: Cost of the battery.
 *                                   - overallCost: Total cost of the installation.
 *                                   - mcsSubmissionId: MCS Submission ID.
 *                                   - customFields - Custom fields data for the plot installation. The object should have the following structure:
 *                                     - {string} entityType - The type of entity the custom fields belong to. For plot installation custom fields, this should be 'plotInstall'.
 *                                     - {string} entityId - The UUID of the specific plot installation instance the custom fields are associated with.
 *                                     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *                                     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *                                       - {string} fieldName - The name or key of the custom field.
 *                                         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *                                         - {string} uiName - Optional: The user-editable name of the custom field.
 *                                         - {string} description - Optional: The user-editable description of the custom field.
 *
 * @returns {String} The plot_install_id of the inserted, updated, or existing plot installation record.
 *
 * @example
 * // Example usage
 * var conn = Jdbc.getConnection('jdbc:mysql://example.com:3306/database', 'user', 'password');
 * var instanceId = 'abc123';
 * var importId = '67890';
 * var plotInstallData = {
 *   plotInstallId: '12345',
 *   plotId: 'abcde',
 *   // ... other fields ...
 * };
 * var plotInstallId = importPlotInstallData(conn, instanceId, importId, plotInstallData);
 */
function importPlotInstallData(conn, instanceId, importId, plotInstallData) {
var checkPlotInstallStmt = conn.prepareStatement('SELECT * FROM sn_plot_install WHERE instance_id = ? AND plot_id = ?');
checkPlotInstallStmt.setString(1, instanceId);
checkPlotInstallStmt.setString(2, plotInstallData.plotId);

    var rs = checkPlotInstallStmt.executeQuery();

    plotInstallData.plotInstallStatus = determineInstallStatus(plotInstallData.dateInstall, plotInstallData.dateChecked);
    if (plotInstallData.plotInstallStatus) {
        var plotInstallStatusId = importStatus(conn, instanceId, importId, { status_state: plotInstallData.plotInstallStatus, status_group: "Install Status Group" });
    }

    if (plotInstallData.meter) {
        var meterProductId = importProductData(conn, instanceId, importId, { productName: plotInstallData.meter, productType: 'Meter', costToday: plotInstallData.meterCost }); //todo change to object
    }
    if (plotInstallData.battery) {
        var batteryProductId = importProductData(conn, instanceId, importId, { productName: plotInstallData.battery, productType: 'Battery', costToday: plotInstallData.batteryCost });
    }

    if (rs.next()) {
        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_plot_install SET instance_id = ?, plot_id = ?, date_install = ?, date_checked = ?, install_by = ?, checked_by = ?, plot_install_status = ?, phase = ?, p1 = ?, p2 = ?, p3 = ?, annual_yield = ?, kwp = ?, kwp_with_limitation = ?, limiter_required = ?, limiter_value_if_not_zero = ?, labour_cost = ?, meter = ?, meter_cost = ?, battery = ?, battery_cost = ?, overall_cost = ?, mcs_submission_id = ?, import_id = ? WHERE plot_install_id = ?');

        updateStmt.setString(1, instanceId);
        updateStmt.setString(2, plotInstallData.plotId);

        // Sanitize and set date_install
        if (plotInstallData.dateInstall) {
            updateStmt.setString(3, sanitizeDateForSql(plotInstallData.dateInstall));
        } else {
            updateStmt.setNull(3, 0); // Setting null for date field
        }

        // Sanitize and set date_checked
        if (plotInstallData.dateChecked) {
            updateStmt.setString(4, sanitizeDateForSql(plotInstallData.dateChecked));
        } else {
            updateStmt.setNull(4, 0); // Setting null for date field
        }

        updateStmt.setString(5, plotInstallData.installBy);
        updateStmt.setString(6, plotInstallData.checkedBy);
        updateStmt.setString(7, plotInstallStatusId); // Ensure this variable is defined and holds the correct status ID
        updateStmt.setInt(8, convertPhaseToInt(plotInstallData.phase)); // Assuming convertPhaseToInt function is defined and returns an integer
        updateStmt.setFloat(9, sanitizeFloat(plotInstallData.p1));
        updateStmt.setFloat(10, sanitizeFloat(plotInstallData.p2));
        updateStmt.setFloat(11, sanitizeFloat(plotInstallData.p3));
        updateStmt.setFloat(12, sanitizeFloat(plotInstallData.annualYield));
        updateStmt.setFloat(13, sanitizeFloat(plotInstallData.kwp));
        updateStmt.setFloat(14, sanitizeFloat(plotInstallData.kwpWithLimitation));
// Sanitize and set limiter_required.
var updateSanitizedLimiterRequired = sanitizeBoolean(plotInstallData.limiterRequired);
if (updateSanitizedLimiterRequired) {
    updateStmt.setBoolean(15, plotInstallData.limiterRequired);
} else {
    updateStmt.setNull(15, 0);
}        updateStmt.setFloat(16, sanitizeFloat(plotInstallData.limiterValueIfNotZero));
        updateStmt.setFloat(17, sanitizeFloat(plotInstallData.labourCost));
        updateStmt.setString(18, meterProductId); // Assuming you have a way to get the meterProductId from plotInstallData.meter
        updateStmt.setFloat(19, sanitizeFloat(plotInstallData.meterCost));
        updateStmt.setString(20, batteryProductId); // Assuming you have a way to get the batteryProductId from plotInstallData.battery
        updateStmt.setFloat(21, sanitizeFloat(plotInstallData.batteryCost));
        updateStmt.setFloat(22, sanitizeFloat(plotInstallData.overallCost));
        updateStmt.setString(23, plotInstallData.mcsSubmissionId);
        updateStmt.setString(24, importId);
        updateStmt.setString(25, plotInstallData.plotInstallId);
        updateStmt.execute();

        // Import custom fields for the existing plot installation
        if (plotInstallData.customFields) {
            plotInstallData.customFields.entityType = 'plotInstall';
            plotInstallData.customFields.entityId = plotInstallData.plotInstallId;
            plotInstallData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, plotInstallData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot installation: ' + plotInstallData.plotInstallId);
            }
        }
    } else {
        // Insert new record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_plot_install (instance_id, plot_install_id, plot_id, date_install, date_checked, install_by, checked_by, plot_install_status, phase, p1, p2, p3, annual_yield, kwp, kwp_with_limitation, limiter_required, limiter_value_if_not_zero, labour_cost, meter, meter_cost, battery, battery_cost, overall_cost, mcs_submission_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)');
        plotInstallData.plotInstallId = Utilities.getUuid();

        insertStmt.setString(1, instanceId);
        insertStmt.setString(2, plotInstallData.plotInstallId);
        insertStmt.setString(3, plotInstallData.plotId);

        // Sanitize and set date_install for insert
        if (plotInstallData.dateInstall) {
            insertStmt.setString(4, sanitizeDateForSql(plotInstallData.dateInstall));
        } else {
            insertStmt.setNull(4, 0); // Setting null for date field
        }

        // Sanitize and set date_checked for insert
        if (plotInstallData.dateChecked) {
            insertStmt.setString(5, sanitizeDateForSql(plotInstallData.dateChecked));
        } else {
            insertStmt.setNull(5, 0); // Setting null for date field
        }

        insertStmt.setString(6, plotInstallData.installBy);
        insertStmt.setString(7, plotInstallData.checkedBy);
        insertStmt.setString(8, plotInstallStatusId);
        insertStmt.setString(9, convertPhaseToInt(plotInstallData.phase));
        insertStmt.setFloat(10, sanitizeFloat(plotInstallData.p1)); // Sanitize p1
        insertStmt.setFloat(11, sanitizeFloat(plotInstallData.p2)); // Sanitize p2
        insertStmt.setFloat(12, sanitizeFloat(plotInstallData.p3)); // Sanitize p3
        insertStmt.setFloat(13, sanitizeFloat(plotInstallData.annualYield)); // Sanitize annualYield
        insertStmt.setFloat(14, sanitizeFloat(plotInstallData.kwp)); // Sanitize kwp
        insertStmt.setFloat(15, sanitizeFloat(plotInstallData.kwpWithLimitation)); // Sanitize kwpWithLimitation
// Sanitize and set limiter_required.
var updateSanitizedLimiterRequired = sanitizeBoolean(plotInstallData.limiterRequired);
if (updateSanitizedLimiterRequired) {
    insertStmt.setBoolean(16, plotInstallData.limiterRequired);
} else {
    insertStmt.setNull(16, 0);
}
        insertStmt.setFloat(17, sanitizeFloat(plotInstallData.limiterValueIfNotZero)); // Sanitize limiterValueIfNotZero
        insertStmt.setFloat(18, sanitizeFloat(plotInstallData.labourCost)); // Sanitize labourCost
        insertStmt.setString(19, meterProductId);
        insertStmt.setFloat(20, sanitizeFloat(plotInstallData.meterCost)); // Sanitize meterCost
        insertStmt.setString(21, batteryProductId);
        insertStmt.setFloat(22, sanitizeFloat(plotInstallData.batteryCost)); // Sanitize batteryCost
        insertStmt.setFloat(23, sanitizeFloat(plotInstallData.overallCost)); // Sanitize overallCost
        insertStmt.setString(24, plotInstallData.mcsSubmissionId);
        insertStmt.setString(25, importId);

        insertStmt.execute();

        // Import custom fields for the new plot installation
        if (plotInstallData.customFields) {
            plotInstallData.customFields.entityType = 'plotInstall';
            plotInstallData.customFields.entityId = plotInstallData.plotInstallId;
            plotInstallData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn,instanceId, importId, plotInstallData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot installation: ' + plotInstallData.plotInstallId);
            }
        }
    }

    rs.close();
    checkPlotInstallStmt.close();
    return plotInstallData.plotInstallId;
}
