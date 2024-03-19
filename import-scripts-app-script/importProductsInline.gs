/**
 * Imports or updates plot specification data into the sn_plot_spec table in the database. This function
 * is designed to handle the insertion of new plot specification records or the updating of existing ones.
 * It uses various sub-functions to handle related data such as the plot's specification status, meter, and battery.
 * The function also ensures traceability by logging each import event in the sn_import_events table.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database. This connection is used
 *                                to execute SQL statements for inserting or updating data in the database.
 * @param {string} instanceId - The unique identifier for the customer instance.
 * @param {string} importId - A unique identifier for the import session.
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
 *
 * @returns {String} The plot_spec_id of the inserted, updated, or existing plot specification record.
 *
 * @example
 * // Example usage
 * var conn = Jdbc.getConnection('jdbc:mysql://example.com:3306/database', 'user', 'password');
 * var instanceId = 'abc123';
 * var importId = '67890';
 * var plotSpecData = {
 *   plotSpecId: '12345',
 *   plotId: 'abcde',
 *   // ... other fields ...
 * };
 * var plotSpecId = importPlotSpecData(conn, instanceId, importId, plotSpecData);
 */
function importPlotSpecData(conn, instanceId, importId, plotSpecData) {
    var checkPlotSpecStmt = conn.prepareStatement('SELECT * FROM sn_plot_spec WHERE instance_id = ? AND (plot_spec_id = ? OR plot_id = ?)');
    checkPlotSpecStmt.setString(1, instanceId);
    checkPlotSpecStmt.setString(2, plotSpecData.plotSpecId);
    checkPlotSpecStmt.setString(3, plotSpecData.plotId);

    var rs = checkPlotSpecStmt.executeQuery();

    plotSpecData.plotInstallStatus = "Specified";
    if (plotSpecData.plotInstallStatus) {
        plotSpecData.plotSpecStatusId = importStatus(conn, instanceId, importId, { status_state: plotSpecData.plotInstallStatus, status_group: "Plot Status Group" });
    }

    if (plotSpecData.meter) {
        var meterProductId = importProductData(conn, instanceId, importId, { productName: plotSpecData.meter, productType: 'Meter', costToday: plotSpecData.meterCost }); //todo wrap these in objects to pass
    }
    if (plotSpecData.battery) {
        var batteryProductId = importProductData(conn, instanceId, importId, { productName: plotSpecData.battery, productType: 'Battery', costToday: plotSpecData.batteryCost });
    }

    if (rs.next()) {
        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_plot_spec SET instance_id = ?, plot_id = ?, date_specified = ?, specified_by = ?, plot_spec_status = ?, phase = ?, p1 = ?, p2 = ?, p3 = ?, annual_yield = ?, kwp = ?, kwp_with_limitation = ?, limiter_required = ?, limiter_value_if_not_zero = ?, labour_cost = ?, meter = ?, meter_cost = ?, battery = ?, battery_cost = ?, overall_cost = ?, landlord_supply = ?, import_id = ? WHERE plot_spec_id = ?');

        updateStmt.setString(1, instanceId);
        updateStmt.setString(2, plotSpecData.plotId);

        var sanitizedDateSpecified = sanitizeDateForSql(plotSpecData.dateSpecified);
        if (sanitizedDateSpecified) {
            updateStmt.setString(3, sanitizedDateSpecified);
        } else {
            updateStmt.setNull(3, 0); // Setting null for date field
        }

        updateStmt.setString(4, plotSpecData.specifiedBy);
        updateStmt.setString(5, plotSpecData.plotSpecStatus);
        updateStmt.setString(6, convertPhaseToInt(plotSpecData.phase));
        updateStmt.setFloat(7, sanitizeFloat(plotSpecData.p1));
        updateStmt.setFloat(8, sanitizeFloat(plotSpecData.p2));
        updateStmt.setFloat(9, sanitizeFloat(plotSpecData.p3));
        updateStmt.setFloat(10, sanitizeFloat(plotSpecData.annualYield));
        updateStmt.setFloat(11, sanitizeFloat(plotSpecData.kwp));
        updateStmt.setFloat(12, sanitizeFloat(plotSpecData.kwpWithLimitation));
        updateStmt.setBoolean(13, plotSpecData.limiterRequired);
        updateStmt.setFloat(14, sanitizeFloat(plotSpecData.limiterValueIfNotZero));
        updateStmt.setFloat(15, sanitizeFloat(plotSpecData.labourCost));
        updateStmt.setString(16, meterProductId); // Ensure you have a way to map plotSpecData.meter to a valid meter ID or value
        updateStmt.setFloat(17, sanitizeFloat(plotSpecData.meterCost));
        updateStmt.setString(18, batteryProductId); // Ensure you have a way to map plotSpecData.battery to a valid battery ID or value
        updateStmt.setFloat(19, sanitizeFloat(plotSpecData.batteryCost));
        updateStmt.setFloat(20, sanitizeFloat(plotSpecData.overallCost));
        updateStmt.setBoolean(21, plotSpecData.landlordSupply);
        updateStmt.setString(22, importId);
        updateStmt.setString(23, plotSpecData.plotSpecId);

        updateStmt.execute();

        // Import custom fields for the existing plot specification
        if (plotSpecData.customFields) {
            plotSpecData.customFields.entityType = 'plotSpec';
            plotSpecData.customFields.entityId = plotSpecData.plotSpecId;
            plotSpecData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, plotSpecData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot specification: ' + plotSpecData.plotSpecId);
            }
        }
    } else {
        // Insert new record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_plot_spec (instance_id, plot_spec_id, plot_id, date_specified, specified_by, plot_spec_status, phase, p1, p2, p3, annual_yield, kwp, kwp_with_limitation, limiter_required, limiter_value_if_not_zero, labour_cost, meter, meter_cost, battery, battery_cost, overall_cost, landlord_supply, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        plotSpecData.plotSpecId = Utilities.getUuid();
        insertStmt.setString(1, instanceId);
        insertStmt.setString(2, plotSpecData.plotSpecId);
        insertStmt.setString(3, plotSpecData.plotId);

        // Sanitize and set date_specified for insert
        if (plotSpecData.dateSpecified) {
            insertStmt.setString(4, sanitizeDateForSql(plotSpecData.dateSpecified)); // Assuming dateSpecified is already a SQL date
        } else {
            insertStmt.setNull(4, 0); // Correct pattern for setting null dates
        }

        insertStmt.setString(5, plotSpecData.specifiedBy);
        insertStmt.setString(6, plotSpecData.plotSpecStatus);
        insertStmt.setString(7, convertPhaseToInt(plotSpecData.phase));
        insertStmt.setFloat(8, sanitizeFloat(plotSpecData.p1));
        insertStmt.setFloat(9, sanitizeFloat(plotSpecData.p2));
        insertStmt.setFloat(10, sanitizeFloat(plotSpecData.p3));
        insertStmt.setFloat(11, sanitizeFloat(plotSpecData.annualYield));
        insertStmt.setFloat(12, sanitizeFloat(plotSpecData.kwp));
        insertStmt.setFloat(13, sanitizeFloat(plotSpecData.kwpWithLimitation));
        insertStmt.setBoolean(14, plotSpecData.limiterRequired);
        insertStmt.setFloat(15, sanitizeFloat(plotSpecData.limiterValueIfNotZero));
        insertStmt.setFloat(16, sanitizeFloat(plotSpecData.labourCost));
        insertStmt.setString(17, meterProductId); // Ensure this matches your data model
        insertStmt.setFloat(18, sanitizeFloat(plotSpecData.meterCost));
        insertStmt.setString(19, batteryProductId); // Ensure this matches your data model
        insertStmt.setFloat(20, sanitizeFloat(plotSpecData.batteryCost));
        insertStmt.setFloat(21, sanitizeFloat(plotSpecData.overallCost));
        insertStmt.setBoolean(22, plotSpecData.landlordSupply);
        insertStmt.setString(23, importId);

        insertStmt.execute();

        // Import custom fields for the new plot specification
        if (plotSpecData.customFields) {
            plotSpecData.customFields.entityType = 'plotSpec';
            plotSpecData.customFields.entityId = plotSpecData.plotSpecId;
            plotSpecData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, plotSpecData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for plot specification: ' + plotSpecData.plotSpecId);
            }
        }
    }

    rs.close();
    checkPlotSpecStmt.close();
    return plotSpecData.plotSpecId;
}
