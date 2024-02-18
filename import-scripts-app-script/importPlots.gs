/**
 * Imports or updates plot data into the `sn_plots` table in the database. This function
 * handles the insertion of new plot records or the updating of existing ones.
 * It relies on various sub-functions for related data such as project details, plot specification,
 * plot installation, and status. The function also ensures traceability by logging each import event.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
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
 * @param {String} importId - A unique identifier for the import session. This is used for traceability in the `sn_import_events` table.
 * @returns {String} The plot_id of the inserted, updated, or existing plot record.
 *
 * @example
 * var conn = Jdbc.getConnection("jdbc:mysql://<database_url>", "<user>", "<password>");
 * var plotData = {
 *   plotId: "123",
 *   // ... other required keys ...
 * };
 * var importId = "import_001";
 * var plotId = importPlotData(conn, plotData, importId);
 */
function importPlotData(conn, plotData, importId) {
    var projectId = importProjectDetails(conn, plotData.projectData);
    var checkPlotStmt = conn.prepareStatement('SELECT * FROM sn_plots WHERE (plot_id = ? OR plot_number = ? AND project_id = ? ) ');
    checkPlotStmt.setString(1, plotData.plotId);
        checkPlotStmt.setString(2, plotData.plotNumber);
        checkPlotStmt.setString(3, projectId);


    var rs = checkPlotStmt.executeQuery();

    if (rs.next()) {
        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_plots SET project_id = ?, plot_number = ?, plot_status = ?, site_id = ?, housetype = ?, g99 = ?, mpan = ?, plot_address_id = ?, plot_approved = ?, commissioning_form_submitted = ?, import_id = ?, tracker_ref = ? WHERE plot_id = ?');

        // Set parameters for updateStmt based on plotData fields
        updateStmt.setString(1, plotData.projectId);
        updateStmt.setString(2, plotData.plotNumber);
        updateStmt.setString(3, plotData.plotStatusId);
        updateStmt.setString(4, plotData.projectData.siteId);
        updateStmt.setString(5, plotData.housetype);
        updateStmt.setBoolean(6, plotData.g99);
        updateStmt.setString(7, plotData.mpan);
        updateStmt.setString(8, plotData.plotAddressId);
        updateStmt.setBoolean(9, plotData.plotApproved);
        updateStmt.setBoolean(10, plotData.commissioningFormSubmitted);
        updateStmt.setString(11, importId);
        updateStmt.setString(12, plotData.trackerRef);
        updateStmt.setString(13, plotData.plotId);

        updateStmt.execute();
    } else {
       const uuid = Utilities.getUuid();
        plotData.plotId = uuid;
        plotSpecData.plotId = uuid;
        plotInstallData.plotId = uuid;

    plotData.projectData.dnoDetailsId = lookupDnoDetailsByMpan(projectData.dnoDetails.refNumber);
    plotData.projectData.regionId = getRegionIdFromRegionNumber(projectData.regionData.regionNumber);
    plotData.projectData.siteId = importSiteData(conn,importId, plotData.siteData);
    plotData.projectData.clientId = importClient(conn,importId,projectData.clientData);
    plotData.projectData.projectProcessId = importProjectProcess(conn, importId, projectData.projectProcessData);
    plotData.projectId = importProjectDetails(conn, importId, plotData.projectData);


    plotData.plotAddressId = importAddressData(conn,importId, plotData.addressData);
    plotData.plotStatusId = importStatus(conn, importId,{ status_state: plotData.plotStatus, status_group: "Plot Status Group" });

    plotData.elevationSpecData.plot_spec_id = importPlotSpecData(conn,importId, plotData.plotSpecData);
    plotData.elevationData.plot_install_id = importPlotInstallData(conn, importId, plotData.plotInstallData);

    plotData.elevationSpecData.plot_spec_id = importElevationInstallData(conn, importId, plotData.elevationData)
    plotData.elevationData.plot_install_id = importElevationSpecData(conn, importId, plotData.elevationSpecData)


        // Insert new record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_plots (plot_id, project_id, plot_number, plot_status, site_id, housetype, g99, mpan, plot_address_id, plot_approved, commissioning_form_submitted, import_id, tracker_ref) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, plotData.plotId);
        insertStmt.setString(2, plotData.projectId);
        insertStmt.setString(3, plotData.plotNumber);
        insertStmt.setString(4, plotData.plotStatusId);
        insertStmt.setString(5, plotData.projectData.siteId);
        insertStmt.setString(6, plotData.housetype);
        insertStmt.setBoolean(7, plotData.g99);
        insertStmt.setString(8, plotData.mpan);
        insertStmt.setString(9, plotData.plotAddressId);
        insertStmt.setBoolean(10, plotData.plotApproved);
        insertStmt.setBoolean(11, plotData.commissioningFormSubmitted);
        insertStmt.setString(12, importId);
        insertStmt.setString(13, plotData.trackerRef);



        insertStmt.execute();
    }

    rs.close();
    checkPlotStmt.close();
    return plotData.plotId;
}
