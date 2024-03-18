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
 *                                - customFields - Custom fields data for the plot specification. The object should have the following structure:
 *                                  - {string} entityType - The type of entity the custom fields belong to. For plot specification custom fields, this should be 'plotSpec'.
 *                                  - {string} entityId - The UUID of the specific plot specification instance the custom fields are associated with.
 *                                  - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *                                  - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *                                    - {string} fieldName - The name or key of the custom field.
 *                                      - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *                                      - {string} uiName - Optional: The user-editable name of the custom field.
 *                                      - {string} description - Optional: The user-editable description of the custom field.
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
function importPlotSpecData(conn, importId, plotSpecData) {
    var checkPlotSpecStmt = conn.prepareStatement('SELECT * FROM sn_plot_spec WHERE plot_spec_id = ? OR plot_id = ?');
    checkPlotSpecStmt.setString(1, plotSpecData.plotSpecId);
    checkPlotSpecStmt.setString(2, plotSpecData.plotId);

    var rs = checkPlotSpecStmt.executeQuery();

    plotSpecData.plotInstallStatus = "Specified";
    if (plotSpecData.plotInstallStatus) {
        plotSpecData.plotSpecStatusId = importStatus(conn, importId, { status_state: plotSpecData.plotInstallStatus, status_group: "Plot Status Group" });
    }

    if (plotSpecData.meter) {
        var meterProductId = importProductData(conn, importId, { productName: plotSpecData.meter, productType: 'Meter', costToday: plotSpecData.meterCost });
    }
    if (plotSpecData.battery) {
        var batteryProductId = importProductData(conn, importId, { productName: plotSpecData.battery, productType: 'Battery', costToday: plotSpecData.batteryCost });
    }

    if (rs.next()) {
        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_plot_spec SET plot_id = ?, date_specified = ?, specified_by = ?, plot_spec_status = ?, phase = ?, p1 = ?, p2 = ?, p3 = ?, annual_yield = ?, kwp = ?, kwp_with_limitation = ?, limiter_required = ?, limiter_value_if_not_zero = ?, labour_cost = ?, meter = ?, meter_cost = ?, battery = ?, battery_cost = ?, overall_cost = ?, landlord_supply = ?, import_id = ? WHERE plot_spec_id = ?');

        updateStmt.setString(1, plotSpecData.plotId);

        var sanitizedDateSpecified = sanitizeDateForSql(plotSpecData.dateSpecified);
        if (sanitizedDateSpecified) {
            updateStmt.setDate(2, sanitizedDateSpecified);
        } else {
            updateStmt.setNull(2, 0); // Setting null for date field
        }

        updateStmt.setString(3, plotSpecData.specifiedBy);
        updateStmt.setString(4, plotSpecData.plotSpecStatus);
        updateStmt.setString(5, convertPhaseToInt(plotSpecData.phase));
        updateStmt.setFloat(6, sanitizeFloat(plotSpecData.p1));
        updateStmt.setFloat(7, sanitizeFloat(plotSpecData.p2));
        updateStmt.setFloat(8, sanitizeFloat(plotSpecData.p3));
        updateStmt.setFloat(9, sanitizeFloat(plotSpecData.annualYield));
        updateStmt.setFloat(10, sanitizeFloat(plotSpecData.kwp));
        updateStmt.setFloat(11, sanitizeFloat(plotSpecData.kwpWithLimitation));
        updateStmt.setBoolean(12, plotSpecData.limiterRequired);
        updateStmt.setFloat(13, sanitizeFloat(plotSpecData.limiterValueIfNotZero));
        updateStmt.setFloat(14, sanitizeFloat(plotSpecData.labourCost));
        updateStmt.setString(15, plotSpecData.meter); // Ensure you have a way to map plotSpecData.meter to a valid meter ID or value
        updateStmt.setFloat(16, sanitizeFloat(plotSpecData.meterCost));
        updateStmt.setString(17, plotSpecData.battery); // Ensure you have a way to map plotSpecData.battery to a valid battery ID or value
        updateStmt.setFloat(18, sanitizeFloat(plotSpecData.batteryCost));
        updateStmt.setFloat(19, sanitizeFloat(plotSpecData.overallCost));
        updateStmt.setBoolean(20, plotSpecData.landlordSupply);
        updateStmt.setString(21, importId);
        updateStmt.setString(22, plotSpecData.plotSpecId);

        updateStmt.execute();

        // Import custom fields for the existing plot specification
        if (plotSpecData.customFields) {
            plotSpecData.customFields.entityType = 'plotSpec';
            plotSpecData.customFields.entityId = plotSpecData.plotSpecId;
            var customFieldsImported = importCustomFields(conn, importId, plotSpecData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot specification: ' + plotSpecData.plotSpecId);
            }
        }
    } else {
        // Insert new record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_plot_spec (plot_spec_id, plot_id, date_specified, specified_by, plot_spec_status, phase, p1, p2, p3, annual_yield, kwp, kwp_with_limitation, limiter_required, limiter_value_if_not_zero, labour_cost, meter, meter_cost, battery, battery_cost, overall_cost, landlord_supply, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        plotSpecData.plotSpecId = Utilities.getUuid();
        insertStmt.setString(1, plotSpecData.plotSpecId);
        insertStmt.setString(2, plotSpecData.plotId);

        // Sanitize and set date_specified for insert
        if (plotSpecData.dateSpecified) {
            insertStmt.setDate(3, plotSpecData.dateSpecified); // Assuming dateSpecified is already a SQL date
        } else {
            insertStmt.setNull(3, 0); // Correct pattern for setting null dates
        }

        insertStmt.setString(4, plotSpecData.specifiedBy);
        insertStmt.setString(5, plotSpecData.plotSpecStatus);
        insertStmt.setString(6, convertPhaseToInt(plotSpecData.phase));
        insertStmt.setFloat(7, sanitizeFloat(plotSpecData.p1));
        insertStmt.setFloat(8, sanitizeFloat(plotSpecData.p2));
        insertStmt.setFloat(9, sanitizeFloat(plotSpecData.p3));
        insertStmt.setFloat(10, sanitizeFloat(plotSpecData.annualYield));
        insertStmt.setFloat(11, sanitizeFloat(plotSpecData.kwp));
        insertStmt.setFloat(12, sanitizeFloat(plotSpecData.kwpWithLimitation));
        insertStmt.setBoolean(13, plotSpecData.limiterRequired);
        insertStmt.setFloat(14, sanitizeFloat(plotSpecData.limiterValueIfNotZero));
        insertStmt.setFloat(15, sanitizeFloat(plotSpecData.labourCost));
        insertStmt.setString(16, plotSpecData.meter); // Ensure this matches your data model
        insertStmt.setFloat(17, sanitizeFloat(plotSpecData.meterCost));
        insertStmt.setString(18, plotSpecData.battery); // Ensure this matches your data model
        insertStmt.setFloat(19, sanitizeFloat(plotSpecData.batteryCost));
        insertStmt.setFloat(20, sanitizeFloat(plotSpecData.overallCost));
        insertStmt.setBoolean(21, plotSpecData.landlordSupply);
        insertStmt.setString(22, importId);

        insertStmt.execute();

        // Import custom fields for the new plot specification
        if (plotSpecData.customFields) {
            plotSpecData.customFields.entityType = 'plotSpec';
            plotSpecData.customFields.entityId = plotSpecData.plotSpecId;
            var customFieldsImported = importCustomFields(conn, importId, plotSpecData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot specification: ' + plotSpecData.plotSpecId);
            }
        }
    }

    rs.close();
    checkPlotSpecStmt.close();
    return plotSpecData.plotSpecId;
}
