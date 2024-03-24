/**
 * Imports elevation install data related to solar installations into the database. This function either updates an existing elevation record or inserts a new one based on the provided plot installation ID and plot ID.
 * It also ensures that associated products like inverters and panels are updated or inserted in the 'sn_products' table by calling the 'importProductData' function.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_elevations_install' and 'sn_products' tables set up.
 *
 * Usage:
 * - Call this function with an instance ID, a unique import ID, and an object containing elevation details.
 * - The function first checks if an elevation record for the specified plot installation ID and plot ID already exists in the database.
 * - If it exists, the function updates the existing record; otherwise, it inserts a new record with a unique UUID.
 * - Associated products like inverters and panels are updated or inserted in the 'sn_products' table using the 'importProductData' function.
 *
 * @param {string} instanceId - The unique identifier for the customer instance.
 * @param {string} importId - A unique identifier for the import session.
 * @param {Object} elevationData - An object containing the elevation details. Expected keys:
 *   - plot_install_id: String - Mandatory. Reference to the plot as specified or as installed.
 *   - plot_id: String - Mandatory. Identifier for the plot.
 *   - type_test_ref: String - Optional. Reference to a type test or technical specification.
 *   - pitch: Float - Optional. Pitch of the installation surface.
 *   - orientation: String - Optional. Orientation of the solar panels.
 *   - kk_figure: Float - Optional. Figure used in calculations.
 *   - kwp: Float - Optional. Kilowatt-peak at this elevation.
 *   - strings: Integer - Optional. Number of strings in the solar setup.
 *   - module_qty: Integer - Optional. Quantity of modules in the setup.
 *   - inverter: String - Optional. Identifier for the inverter used.
 *   - inverter_cost: Float - Optional. Cost of the inverter.
 *   - panel: String - Optional. Identifier for the solar panel type.
 *   - panel_cost: Float - Optional. Cost of the solar panels.
 *   - panels_total_cost: Float - Optional. Total cost of all panels used.
 *   - roof_kit: String - Optional. Identifier for the roof mounting kit.
 *   - roof_kit_cost: Float - Optional. Cost of the roof mounting kit.
 *   - annual_yield: Float - Optional. Expected annual energy yield.
 *   - customFields - Custom fields data for the elevation install. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For elevation install custom fields, this should be 'elevationInstall'.
 *     - {string} entityId - The UUID of the specific elevation install instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 *
 * @returns {String} UUID of the existing or new elevation record.
 *
 * Note:
 * - The function logs actions and errors to the console for tracking purposes.
 * - It's important to ensure proper error handling around database operations.
 * - This function relies on 'importProductData' to manage the insertion or updating of product-related information in the 'sn_products' table.
 */
function importElevationInstallData(conn, instanceId, importId, elevationData) {
    //console.log(JSON.stringify(elevationData))
    if (!elevationData.plot_install_id || !elevationData.plot_id || !instanceId) {
        console.log("Plot install ID and plot ID are required.");
        return;
    }

    // Insert or update inverter and panel details in product table
    if (elevationData.inverter) {
        importProductData(conn, instanceId,importId, { productName: elevationData.inverter, productType: 'Inverter', costToday: elevationData.inverter_cost });
    }

    if (elevationData.panel) {
        importProductData(conn, instanceId, importId, { productName: elevationData.panel, productType: 'Panel', costToday: elevationData.panel_cost });
    }

var checkElevationStmt = conn.prepareStatement('SELECT * FROM sn_elevations_install WHERE instance_id = ? AND plot_id = ? AND pitch = ? AND orientation = ?');
checkElevationStmt.setString(1, instanceId);
checkElevationStmt.setString(2, elevationData.plot_id);
checkElevationStmt.setFloat(3, elevationData.pitch);
checkElevationStmt.setString(4, elevationData.orientation);
var rs = checkElevationStmt.executeQuery();

    if (rs.next()) {
        var existingUuid = rs.getString('elevation_install_id');
        console.log("Elevation already exists with UUID: " + existingUuid);

        // Optionally update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_elevations_install SET type_test_ref = ?, pitch = ?, orientation = ?, kk_figure = ?, kwp = ?, strings = ?, module_qty = ?, inverter = ?, inverter_cost = ?, panel = ?, panel_cost = ?, panels_total_cost = ?, roof_kit = ?, roof_kit_cost = ?, annual_yield = ?, import_id = ? WHERE instance_id = ? AND elevation_install_id = ?');

        updateStmt.setString(1, elevationData.type_test_ref || rs.getString('type_test_ref'));
        updateStmt.setFloat(2, sanitizeFloat(elevationData.pitch !== undefined ? elevationData.pitch : rs.getFloat('pitch'))); // Sanitized pitch
        updateStmt.setString(3, elevationData.orientation || rs.getString('orientation'));
        updateStmt.setFloat(4, sanitizeFloat(elevationData.kk_figure !== undefined ? elevationData.kk_figure : rs.getFloat('kk_figure'))); // Sanitized kk_figure
        updateStmt.setFloat(5, sanitizeFloat(elevationData.kwp !== undefined ? elevationData.kwp : rs.getFloat('kwp'))); // Sanitized kwp
        updateStmt.setInt(6, sanitizeInt(elevationData.strings !== undefined ? elevationData.strings : rs.getInt('strings')));
        updateStmt.setInt(7, sanitizeInt((elevationData.module_qty !== undefined ? elevationData.module_qty : rs.getInt('module_qty'))));
        updateStmt.setString(8, elevationData.inverter || rs.getString('inverter'));
        updateStmt.setFloat(9, sanitizeFloat(elevationData.inverter_cost !== undefined ? elevationData.inverter_cost : rs.getFloat('inverter_cost'))); // Sanitized inverter_cost
        updateStmt.setString(10, elevationData.panel || rs.getString('panel'));
        updateStmt.setFloat(11, sanitizeFloat(elevationData.panel_cost !== undefined ? elevationData.panel_cost : rs.getFloat('panel_cost'))); // Sanitized panel_cost
        updateStmt.setFloat(12, sanitizeFloat(elevationData.panels_total_cost !== undefined ? elevationData.panels_total_cost : rs.getFloat('panels_total_cost'))); // Sanitized panels_total_cost
        updateStmt.setString(13, elevationData.roof_kit || rs.getString('roof_kit'));
        updateStmt.setFloat(14, sanitizeFloat(elevationData.roof_kit_cost !== undefined ? elevationData.roof_kit_cost : rs.getFloat('roof_kit_cost'))); // Sanitized roof_kit_cost
        updateStmt.setFloat(15, sanitizeFloat(elevationData.annual_yield !== undefined ? elevationData.annual_yield : rs.getFloat('annual_yield'))); // Sanitized annual_yield
        updateStmt.setString(16, importId);
        updateStmt.setString(17, instanceId);
        updateStmt.setString(18, existingUuid);

        updateStmt.execute();
        console.log("Elevation data updated for UUID: " + existingUuid);

        // Import custom fields for the existing elevation install
        if (elevationData.customFields) {
            elevationData.customFields.entityType = 'elevationInstall';
            elevationData.customFields.entityId = existingUuid;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, elevationData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for elevation install: ' + existingUuid);
            }
        }

        return existingUuid; // Returning the existing UUID
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_elevations_install (elevation_install_id, instance_id, plot_install_id, plot_id, type_test_ref, pitch, orientation, kk_figure, kwp, strings, module_qty, inverter, inverter_cost, panel, panel_cost, panels_total_cost, roof_kit, roof_kit_cost, annual_yield, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        var newUuid = Utilities.getUuid();
        insertStmt.setString(1, newUuid);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, elevationData.plot_install_id);
        insertStmt.setString(4, elevationData.plot_id);
        insertStmt.setString(5, elevationData.type_test_ref);
        insertStmt.setFloat(6, sanitizeFloat(elevationData.pitch)); // Sanitized pitch
        insertStmt.setString(7, elevationData.orientation);
        insertStmt.setFloat(8, sanitizeFloat(elevationData.kk_figure)); // Sanitized kk_figure
        insertStmt.setFloat(9, sanitizeFloat(elevationData.kwp)); // Sanitized kwp
        insertStmt.setInt(10, sanitizeInt(elevationData.strings));
        insertStmt.setInt(11, sanitizeInt(elevationData.module_qty));
        insertStmt.setString(12, elevationData.inverter);
        insertStmt.setFloat(13, sanitizeFloat(elevationData.inverter_cost)); // Sanitized inverter_cost
        insertStmt.setString(14, elevationData.panel);
        insertStmt.setFloat(15, sanitizeFloat(elevationData.panel_cost)); // Sanitized panel_cost
        insertStmt.setFloat(16, sanitizeFloat(elevationData.panels_total_cost)); // Sanitized panels_total_cost
        insertStmt.setString(17, elevationData.roof_kit);
        insertStmt.setFloat(18, sanitizeFloat(elevationData.roof_kit_cost)); // Sanitized roof_kit_cost
        insertStmt.setFloat(19, sanitizeFloat(elevationData.annual_yield)); // Sanitized annual_yield
        insertStmt.setString(20, importId);

        insertStmt.execute();
        console.log("New elevation installed with UUID: " + newUuid);

        // Import custom fields for the new elevation install
        if (elevationData.customFields) {
            elevationData.customFields.entityType = 'elevationInstall';
            elevationData.customFields.entityId = newUuid;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, elevationData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for elevation install: ' + newUuid);
            }
        }

        return newUuid; // Returning the new UUID
    }

    rs.close();
    checkElevationStmt.close();
}
