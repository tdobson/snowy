/**
 * Imports or updates plot specification data into the sn_plot_spec table in the database. This function
 * is designed to handle the insertion of new plot specification records or the updating of existing ones.
 * It uses various sub-functions to handle related data such as the plot's specification status, meter, and battery.
 * The function also ensures traceability by logging each import event in the sn_import_events table.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database. This connection is used
 *                                to execute SQL statements for inserting or updating data in the database.
 * @param {Object} plotSpecData - An object containing all necessary plot specification details. The structure
 *                                is expected to match the columns of the sn_plot_spec table. It should include:
 *                                - plotSpecId: Unique identifier for the plot specification.
 *                                - plotId: Unique identifier for the plot.
 *                                - dateSpecified: Date when the specification was made.
 *                                - specifiedBy: User ID of the person who specified this plot.
 *                                - plotSpecStatus: Status of the plot specification.
 *                                - phase: Phase information (1 or 3 phase).
 *                                - p1, p2, p3: Details specific to each phase.
 *                                - annualYield: Expected annual yield from the plot.
 *                                - kwp: Kilowatt-peak of the plot.
 *                                - kwpWithLimitation: Kilowatt-peak with limitations.
 *                                - limiterRequired: Indicates if a power limiter was required.
 *                                - limiterValueIfNotZero: Value of the limiter if not zero.
 *                                - labourCost: Labour cost of the specification.
 *                                - meter: Meter product ID.
 *                                - meterCost: Cost of the meter.
 *                                - battery: Battery product ID.
 *                                - batteryCost: Cost of the battery.
 *                                - overallCost: Total cost associated with this plot specification.
 *                                - landlordSupply: Indicates if the landlord is responsible for the supply.
 * @param {String} importId - A unique identifier for the import session. This ID is used for logging the import
 *                            event in the sn_import_events table for traceability.
 *
 * @returns {String} The plot_spec_id of the inserted, updated, or existing plot specification record.
 *
 * @example
 * // Example usage
 * var conn = Jdbc.getConnection('jdbc:mysql://example.com:3306/database', 'user', 'password');
 * var plotSpecData = {
 *   plotSpecId: '12345',
 *   plotId: 'abcde',
 *   // ... other fields ...
 * };
 * var importId = '67890';
 * var plotSpecId = importPlotSpecData(conn, plotSpecData, importId);
 */
function importPlotSpecData(conn,importId, plotSpecData) {
    var checkPlotSpecStmt = conn.prepareStatement('SELECT * FROM sn_plot_spec WHERE plot_spec_id = ? OR plot_id = ?');
    checkPlotSpecStmt.setString(1, plotSpecData.plotSpecId);
        checkPlotSpecStmt.setString(2, plotSpecData.plotId);


    var rs = checkPlotSpecStmt.executeQuery();

if (plotSpecData.plotInstallStatus) {
     plotSpecData.plotSpecStatusId = importStatus(conn,importId,{ status_state: plotSpecData.plotInstallStatus, status_group: "Plot Status Group" });
     }

          if (plotSpecData.meter) {
     var meterProductId = importProductData(conn,importId,{ productName: plotSpecData.meter, productType: 'Meter', costToday: plotSpecData.meterCost });
     }
               if (plotSpecData.battery) {
     var batteryProductId = importProductData(conn,importId,{ productName: plotSpecData.battery, productType: 'Battery', costToday: plotSpecData.batteryCost });
     }

    if (rs.next()) {
        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_plot_spec SET plot_id = ?, date_specified = ?, specified_by = ?, plot_spec_status = ?, phase = ?, p1 = ?, p2 = ?, p3 = ?, annual_yield = ?, kwp = ?, kwp_with_limitation = ?, limiter_required = ?, limiter_value_if_not_zero = ?, labour_cost = ?, meter = ?, meter_cost = ?, battery = ?, battery_cost = ?, overall_cost = ?, landlord_supply = ?, import_id = ? WHERE plot_spec_id = ?');

        // Set parameters for updateStmt based on plotSpecData fields
        updateStmt.setString(1, plotSpecData.plotId);
        updateStmt.setDate(2, plotSpecData.dateSpecified);
        updateStmt.setString(3, plotSpecData.specifiedBy);
        updateStmt.setString(4, plotSpecData.plotSpecStatusId);
        updateStmt.setInt(5, plotSpecData.phase);
        updateStmt.setFloat(6, plotSpecData.p1);
        updateStmt.setFloat(7, plotSpecData.p2);
        updateStmt.setFloat(8, plotSpecData.p3);
        updateStmt.setFloat(9, plotSpecData.annualYield);
        updateStmt.setFloat(10, plotSpecData.kwp);
        updateStmt.setFloat(11, plotSpecData.kwpWithLimitation);
        updateStmt.setBoolean(12, plotSpecData.limiterRequired);
        updateStmt.setFloat(13, plotSpecData.limiterValueIfNotZero);
        updateStmt.setFloat(14, plotSpecData.labourCost);
        updateStmt.setString(15, meterProductId);
        updateStmt.setFloat(16, plotSpecData.meterCost);
        updateStmt.setString(17, batteryProductId);
        updateStmt.setFloat(18, plotSpecData.batteryCost);
        updateStmt.setFloat(19, plotSpecData.overallCost);
        updateStmt.setBoolean(20, plotSpecData.landlordSupply);
        updateStmt.setString(21, importId);
        updateStmt.setString(22, plotSpecData.plotSpecId);

        updateStmt.execute();
    } else {
        // Insert new record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_plot_spec (plot_spec_id, plot_id, date_specified, specified_by, plot_spec_status, phase, p1, p2, p3, annual_yield, kwp, kwp_with_limitation, limiter_required, limiter_value_if_not_zero, labour_cost, meter, meter_cost, battery, battery_cost, overall_cost, landlord_supply, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        plotSpecData.plotSpecId = Utilities.getUuid();
        insertStmt.setString(1, plotSpecData.plotSpecId);
        insertStmt.setString(2, plotSpecData.plotId);
        insertStmt.setDate(3, plotSpecData.dateSpecified);
        insertStmt.setString(4, plotSpecData.specifiedBy);
        insertStmt.setString(5, plotSpecData.plotSpecStatusId);
        insertStmt.setInt(6, plotSpecData.phase);
        insertStmt.setFloat(7, plotSpecData.p1);
        insertStmt.setFloat(8, plotSpecData.p2);
        insertStmt.setFloat(9, plotSpecData.p3);
        insertStmt.setFloat(10, plotSpecData.annualYield);
        insertStmt.setFloat(11, plotSpecData.kwp);
        insertStmt.setFloat(12, plotSpecData.kwpWithLimitation);
        insertStmt.setBoolean(13, plotSpecData.limiterRequired);
        insertStmt.setFloat(14, plotSpecData.limiterValueIfNotZero);
        insertStmt.setFloat(15, plotSpecData.labourCost);
        insertStmt.setString(16, meterProductId);
        insertStmt.setFloat(17, plotSpecData.meterCost);
        insertStmt.setString(18, batteryProductId);
        insertStmt.setFloat(19, plotSpecData.batteryCost);
        insertStmt.setFloat(20, plotSpecData.overallCost);
        insertStmt.setBoolean(21, plotSpecData.landlordSupply);
        insertStmt.setString(22, importId);

        insertStmt.execute();
    }

    rs.close();
    checkPlotSpecStmt.close();
    return plotSpecData.plotSpecId;
}
