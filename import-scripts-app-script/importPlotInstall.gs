/**
 * Imports or updates plot installation data into the sn_plot_install table in a database. This function
 * is designed to handle the insertion of new plot installation records or the updating of existing ones.
 * It uses various sub-functions to handle related data such as the plot's installation status, meter, and battery.
 * The function also ensures traceability by logging each import event in the sn_import_events table.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database. This connection is used
 *                                to execute SQL statements for inserting or updating data in the database.
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
 * @param {String} importId - A unique identifier for the import session. This ID is used for logging the import
 *                            event in the sn_import_events table for traceability.
 *
 * @returns {String} The plot_install_id of the inserted, updated, or existing plot installation record.
 *
 * @example
 * // Example usage
 * var conn = Jdbc.getConnection('jdbc:mysql://example.com:3306/database', 'user', 'password');
 * var plotInstallData = {
 *   plotInstallId: '12345',
 *   plotId: 'abcde',
 *   // ... other fields ...
 * };
 * var importId = '67890';
 * var plotInstallId = importPlotInstallData(conn, plotInstallData, importId);
 */
 function importPlotInstallData(conn, plotInstallData, importId) {

     var checkPlotInstallStmt = conn.prepareStatement('SELECT * FROM sn_plot_install WHERE plot_install_id = ? OR plot_id = ?');
     checkPlotInstallStmt.setString(1, plotInstallData.plotInstallId);
         checkPlotInstallStmt.setString(2, plotInstallData.plotId);

     var rs = checkPlotInstallStmt.executeQuery();

     var plotInstallStatusId = importStatus({ status_state: plotInstallData.plotInstallStatus, status_group: "Install Status Group" }, conn);
     var meterProductId = importProductData({ productName: plotInstallData.meter, productType: 'Meter' }, importId, conn);
     var batteryProductId = importProductData({ productName: plotInstallData.battery, productType: 'Battery' }, importId, conn);

     if (rs.next()) {
         // Update existing record
         var updateStmt = conn.prepareStatement('UPDATE sn_plot_install SET plot_id = ?, date_install = ?, date_checked = ?, install_by = ?, checked_by = ?, plot_install_status = ?, phase = ?, p1 = ?, p2 = ?, p3 = ?, annual_yield = ?, kwp = ?, kwp_with_limitation = ?, limiter_required = ?, limiter_value_if_not_zero = ?, labour_cost = ?, meter = ?, meter_cost = ?, battery = ?, battery_cost = ?, overall_cost = ?, mcs_submission_id = ?, import_id = ? WHERE plot_install_id = ?');

         // Set parameters for updateStmt based on plotInstallData fields
         updateStmt.setString(1, plotInstallData.plotId);
         updateStmt.setDate(2, plotInstallData.dateInstall);
         updateStmt.setDate(3, plotInstallData.dateChecked);
         updateStmt.setString(4, plotInstallData.installBy);
         updateStmt.setString(5, plotInstallData.checkedBy);
         updateStmt.setString(6, plotInstallStatusId);
         updateStmt.setInt(7, plotInstallData.phase);
         updateStmt.setFloat(8, plotInstallData.p1);
         updateStmt.setFloat(9, plotInstallData.p2);
         updateStmt.setFloat(10, plotInstallData.p3);
         updateStmt.setFloat(11, plotInstallData.annualYield);
         updateStmt.setFloat(12, plotInstallData.kwp);
         updateStmt.setFloat(13, plotInstallData.kwpWithLimitation);
         updateStmt.setBoolean(14, plotInstallData.limiterRequired);
         updateStmt.setFloat(15, plotInstallData.limiterValueIfNotZero);
         updateStmt.setFloat(16, plotInstallData.labourCost);
         updateStmt.setString(17, meterProductId);
         updateStmt.setFloat(18, plotInstallData.meterCost);
         updateStmt.setString(19, batteryProductId);
         updateStmt.setFloat(20, plotInstallData.batteryCost);
         updateStmt.setFloat(21, plotInstallData.overallCost);
         updateStmt.setString(22, plotInstallData.mcsSubmissionId);
         updateStmt.setString(23, importId);
         updateStmt.setString(24, plotInstallData.plotInstallId);

         updateStmt.execute();
     } else {
         // Insert new record
         var insertStmt = conn.prepareStatement('INSERT INTO sn_plot_install (plot_install_id, plot_id, date_install, date_checked, install_by, checked_by, plot_install_status, phase, p1, p2, p3, annual_yield, kwp, kwp_with_limitation, limiter_required, limiter_value_if_not_zero, labour_cost, meter, meter_cost, battery, battery_cost, overall_cost, mcs_submission_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

         insertStmt.setString(1, plotInstallData.plotInstallId);
         insertStmt.setString(2, plotInstallData.plotId);
         insertStmt.setDate(3, plotInstallData.dateInstall);
         insertStmt.setDate(4, plotInstallData.dateChecked);
         insertStmt.setString(5, plotInstallData.installBy);
         insertStmt.setString(6, plotInstallData.checkedBy);
         insertStmt.setString(7, plotInstallStatusId);
         insertStmt.setInt(8, plotInstallData.phase);
         insertStmt.setFloat(9, plotInstallData.p1);
         insertStmt.setFloat(10, plotInstallData.p2);
         insertStmt.setFloat(11, plotInstallData.p3);
         insertStmt.setFloat(12, plotInstallData.annualYield);
         insertStmt.setFloat(13, plotInstallData.kwp);
         insertStmt.setFloat(14, plotInstallData.kwpWithLimitation);
         insertStmt.setBoolean(15, plotInstallData.limiterRequired);
         insertStmt.setFloat(16, plotInstallData.limiterValueIfNotZero);
         insertStmt.setFloat(17, plotInstallData.labourCost);
         insertStmt.setString(18, meterProductId);
         insertStmt.setFloat(19, plotInstallData.meterCost);
         insertStmt.setString(20, batteryProductId);
         insertStmt.setFloat(21, plotInstallData.batteryCost);
         insertStmt.setFloat(22, plotInstallData.overallCost);
         insertStmt.setString(23, plotInstallData.mcsSubmissionId);
         insertStmt.setString(24, importId);

         insertStmt.execute();
     }

     rs.close();
     checkPlotInstallStmt.close();
     return plotInstallData.plotInstallId;
 }
