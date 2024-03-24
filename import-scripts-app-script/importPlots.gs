/**
 * Imports or updates plot data into the `sn_plots` table in the database. This function
 * handles the insertion of new plot records or the updating of existing ones.
 * It relies on various sub-functions for related data such as project details, plot specification,
 * plot installation, and status. The function also ensures traceability by logging each import event.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} instanceId - The UUID of the instance or customer associated with the plot data.
 * @param {String} importId - A unique identifier for the import session. This is used for traceability in the `sn_import_events` table.
 * @param {Object} plotData - Object containing all necessary plot details. Expected keys:
 *   - plotId: Unique identifier for the plot.
 *   - projectId: Identifier for the project the plot belongs to. This is obtained by calling `importProjectDetails`.
 *   - plotNumber: Alphanumeric identifier for the plot.
 *   - plotStatus: Current status of the plot. This is updated using `importStatus`.
 *   - siteId: Identifier for the site where the plot is located, obtained via `importSiteData`.
 *   - housetype: Description of the type of house on the plot.
 *   - g99: Boolean indicating whether G99 standards apply.
 *   - mpan: MPAN (Meter Point Administration Number) for the plot.
 *   - plotAddressId: Plot Address ID, fetched using `importAddressData`.
 *   - plotApproved: Boolean indicating whether the plot has been approved.
 *   - commissioningFormSubmitted: Boolean indicating whether the commissioning form has been submitted.
 *   - trackerRef: Reference to a tracking system.
 *   - customFields - Custom fields data for the plot. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For plot custom fields, this should be 'plot'.
 *     - {string} entityId - The UUID of the specific plot instance the custom fields are associated with.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 * @param {Sheet} sheet - The Google Sheets Sheet object, used for fetching region details based on the PV number.
 * @returns {String} The plot_id of the inserted, updated, or existing plot record.
 *
 * @example
 * var conn = Jdbc.getConnection("jdbc:mysql://<database_url>", "<user>", "<password>");
 * var instanceId = "instance_001";
 * var importId = "import_001";
 * var plotData = {
 *   plotId: "123",
 *   // ... other required keys ...
 * };
 * var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RegionData");
 * var plotId = importPlotData(conn, instanceId, importId, plotData, sheet);
 */
function importPlotData(conn, instanceId, importId, plotData, sheet) {
    var checkPlotStmt = conn.prepareStatement('SELECT * FROM sn_plots WHERE instance_id = ? AND (plot_id = ? OR plot_number = ? AND tracker_ref = ?)');
    checkPlotStmt.setString(1, instanceId);
    checkPlotStmt.setString(2, plotData.plotId);
    checkPlotStmt.setString(3, plotData.plotNumber);
    checkPlotStmt.setString(4, plotData.trackerRef);

    var rs = checkPlotStmt.executeQuery();

    if (rs.next()) {
        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_plots SET project_id = ?, plot_number = ?, plot_status = ?, site_id = ?, housetype = ?, g99 = ?, mpan = ?, plot_address_id = ?, plot_approved = ?, commissioning_form_submitted = ?, import_id = ?, tracker_ref = ? WHERE instance_id = ? AND plot_id = ?  ');

        updateStmt.setString(1, plotData.projectId);
        updateStmt.setString(2, plotData.plotNumber);
        updateStmt.setString(3, plotData.plotStatusId);
        updateStmt.setString(4, plotData.projectData.siteId);
        updateStmt.setString(5, plotData.housetype);
// Sanitize and set g99
var sanitizedG99 = sanitizeBoolean(plotData.g99);
if (sanitizedG99) {
    updateStmt.setBoolean(6, plotData.g99);
} else {
    updateStmt.setNull(6, 0);
}

updateStmt.setString(7, plotData.mpan);
updateStmt.setString(8, plotData.plotAddressId);

// Sanitize and set plot_approved
var sanitizedPlotApproved = sanitizeBoolean(plotData.plotApproved);
if (sanitizedPlotApproved) {
    updateStmt.setBoolean(9, plotData.plotApproved);
} else {
    updateStmt.setNull(9, 0);
}

// Sanitize and set commissioning_form_submitted
var sanitizedCommissioningFormSubmitted = sanitizeBoolean(plotData.commissioningFormSubmitted);
if (sanitizedCommissioningFormSubmitted) {
    updateStmt.setBoolean(10, plotData.commissioningFormSubmitted);
} else {
    updateStmt.setNull(10, 0);
}
        updateStmt.setString(11, importId);
        updateStmt.setString(12, plotData.trackerRef);
        updateStmt.setString(13, instanceId);
        updateStmt.setString(14, plotData.plotId);



        updateStmt.execute();

        // Import custom fields for the existing plot
        if (plotData.customFields) {
            plotData.customFields.entityType = 'plot';
            plotData.customFields.entityId = plotData.plotId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, plotData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot: ' + plotData.plotId);
            }
        }
    } else {
        const uuid = Utilities.getUuid();
        plotData.plotId = uuid;
        plotData.plotSpecData.plotId = uuid;
        plotData.plotInstallData.plotId = uuid;
        plotData.elevationData.plot_id = uuid;
        plotData.elevationSpecData.plot_id = uuid;

        plotData.projectData.dnoDetailsId = lookupDnoDetailsByMpan(conn, instanceId, importId, plotData.projectData.dnoDetails.refNumber);
        plotData.projectData.regionId = getRegionIdFromRegionNumber(plotData.siteData.addressData.address_region_number);
        plotData.projectData.siteId = importSiteData(conn, instanceId, importId, plotData.siteData, sheet);
        plotData.projectData.clientId = importClient(conn, instanceId, importId, plotData.projectData.clientData, sheet);
        plotData.projectData.projectProcessId = importProjectProcess(conn, instanceId, importId, plotData.projectData.projectProcessData);
        plotData.projectId = importProject(conn, instanceId, importId, plotData.projectData);

        plotData.plotAddressId = importAddress(conn, instanceId, importId, plotData.addressData);
        plotData.plotStatusId = importStatus(conn, instanceId, importId, { status_state: plotData.plotStatus, status_group: "Plot Status Group" });

        plotData.elevationSpecData.plot_spec_id = importPlotSpecData(conn, instanceId, importId, plotData.plotSpecData);
        plotData.elevationData.plot_install_id = importPlotInstallData(conn, instanceId, importId, plotData.plotInstallData);

        plotData.elevationData.elevation_install_id = importElevationInstallData(conn, instanceId, importId, plotData.elevationData);
        plotData.elevationSpecData.elevation_spec_id = importElevationSpecData(conn, instanceId, importId, plotData.elevationSpecData);

        // Insert new record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_plots (plot_id, instance_id, project_id, plot_number, plot_status, site_id, housetype, g99, mpan, plot_address_id, plot_approved, commissioning_form_submitted, import_id, tracker_ref, plot_install_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)');

        insertStmt.setString(1, plotData.plotId);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, plotData.projectId);
        insertStmt.setString(4, plotData.plotNumber);
        insertStmt.setString(5, plotData.plotStatusId);
        insertStmt.setString(6, plotData.projectData.siteId);
        insertStmt.setString(7, plotData.housetype);
// Sanitize and set g99
var sanitizedG99 = sanitizeBoolean(plotData.g99);
if (sanitizedG99) {
    insertStmt.setBoolean(8, plotData.g99);
} else {
    insertStmt.setNull(8, 0);
}

insertStmt.setString(9, plotData.mpan);
insertStmt.setString(10, plotData.plotAddressId);

// Sanitize and set plot_approved
var sanitizedPlotApproved = sanitizeBoolean(plotData.plotApproved);
if (sanitizedPlotApproved) {
    insertStmt.setBoolean(11, plotData.plotApproved);
} else {
    insertStmt.setNull(11, 0);
}

// Sanitize and set commissioning_form_submitted
var sanitizedCommissioningFormSubmitted = sanitizeBoolean(plotData.commissioningFormSubmitted);
if (sanitizedCommissioningFormSubmitted) {
    insertStmt.setBoolean(12, plotData.commissioningFormSubmitted);
} else {
    insertStmt.setNull(12, 0);
}
        insertStmt.setString(13, importId);
        insertStmt.setString(14, plotData.trackerRef);
        insertStmt.setString(15, plotData.elevationData.plot_install_id);


        insertStmt.execute();

        // Import custom fields for the new plot
        if (plotData.customFields) {
            plotData.customFields.entityType = 'plot';
            plotData.customFields.entityId = plotData.plotId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, plotData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot: ' + plotData.plotId);
            }
        }
    }

    rs.close();
    checkPlotStmt.close();
    return plotData.plotId;
}
