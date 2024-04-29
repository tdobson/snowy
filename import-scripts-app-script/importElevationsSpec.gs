/**
 * Imports elevation specification data related to solar installations into the database. This function either updates an existing elevation specification record or inserts a new one based on the provided plot specification ID and plot ID.
 * It also ensures that associated products like inverters and panels are updated or inserted in the 'sn_products' table by calling the 'importProductData' function.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_elevations_spec' and 'sn_products' tables set up.
 *
 * Usage:
 * - Call this function with a database connection, an instance ID, a unique import ID, and an object containing elevation specification details.
 * - The function first checks if an elevation specification record for the specified plot specification ID and plot ID already exists in the database.
 * - If it exists, the function updates the existing record; otherwise, it inserts a new record with a unique UUID.
 * - Associated products like inverters and panels are updated or inserted in the 'sn_products' table using the 'importProductData' function.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The unique identifier for the customer instance.
 * @param {string} importId - A unique identifier for the import session.
 * @param {Object} elevationSpecData - An object containing the elevation specification details. Expected keys:
 *   - plot_spec_id: String - Mandatory. Reference to the plot specification.
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
 *   - customFields - Custom fields data for the elevation specification. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For elevation specification custom fields, this should be 'elevationSpec'.
 *     - {string} entityId - The UUID of the specific elevation specification instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 *
 * @returns {String} UUID of the existing or new elevation specification record.
 *
 * Note:
 * - The function logs actions and errors to the console for tracking purposes.
 * - It's important to ensure proper error handling around database operations.
 * - This function relies on 'importProductData' to manage the insertion or updating of product-related information in the 'sn_products' table.
 */
function importElevationSpecData(conn, instanceId, importId, elevationSpecData) {
    if (!elevationSpecData.plot_spec_id || !elevationSpecData.plot_id || !instanceId) {
        console.log("Plot spec ID and plot ID are required.");
        return;
    }

    // Insert or update inverter and panel details in product table
    if (elevationSpecData.inverter) {
       elevationSpecData.inverter_id = importProductData(conn, instanceId, importId, { productName: elevationSpecData.inverter, productType: 'Inverter', costToday: elevationSpecData.inverter_cost, manufacturer: elevationSpecData.inverter_manufacturer }); //todo send a product object to this function
    }

    if (elevationSpecData.panel) {
      elevationSpecData.panel_id =  importProductData(conn,instanceId, importId, { productName: elevationSpecData.panel, productType: 'Panel', costToday: elevationSpecData.panel_cost });
    }

        if (elevationSpecData.roof_kit) {
          elevationSpecData.roof_kit_id =   importProductData(conn,instanceId, importId, { productName: elevationSpecData.roof_kit, productType: 'Roof Kit', costToday: elevationSpecData.roof_kit_cost });
        }

// Check if elevation spec data already exists
var checkElevationSpecStmt = conn.prepareStatement("SELECT * FROM sn_plots p JOIN sn_plot_spec ps ON p.plot_id = ps.plot_id JOIN sn_elevations_spec es ON ps.plot_spec_id = es.plot_spec_id JOIN sn_custom_fields elevationno ON es.elevation_spec_id = elevationno.entity_id AND elevationno.entity_type = 'elevationSpec' AND elevationno.field_name = 'Elevation_No' JOIN sn_custom_fields variationfromsouth ON es.elevation_spec_id = variationfromsouth.entity_id AND variationfromsouth.entity_type = 'elevationSpec' AND variationfromsouth.field_name = 'Input_Variation_from_South' WHERE p.instance_id = ? AND p.plot_id = ? AND es.plot_spec_id = ? AND pitch = ? AND orientation = ? AND elevationno.field_value = ? AND type_test_ref = ? AND module_qty = ? AND variationfromsouth.field_value = ?");
checkElevationSpecStmt.setString(1, instanceId);
checkElevationSpecStmt.setString(2, elevationSpecData.plot_id);
checkElevationSpecStmt.setString(3, elevationSpecData.plot_spec_id);
checkElevationSpecStmt.setString(4, elevationSpecData.pitch);
checkElevationSpecStmt.setString(5, elevationSpecData.orientation);
checkElevationSpecStmt.setString(6, elevationSpecData.customFields.fields.Elevation_No);
checkElevationSpecStmt.setString(7, elevationSpecData.type_test_ref);
checkElevationSpecStmt.setString(8, elevationSpecData.module_qty);
checkElevationSpecStmt.setString(9, elevationSpecData.customFields.fields.Input_Variation_from_South);
var rs = checkElevationSpecStmt.executeQuery();

    elevationSpecData.customFields.fields.elevationNumber = elevationSpecData.customFields.fields.Elevation_No


    if (rs.next()) {
        var existingUuid = rs.getString('elevation_spec_id');
        console.log("Elevation spec already exists with UUID: " + existingUuid);

        // Update existing record
        var updateStmt = conn.prepareStatement('UPDATE sn_elevations_spec SET type_test_ref = ?, pitch = ?, orientation = ?, kk_figure = ?, kwp = ?, strings = ?, module_qty = ?, inverter = ?, inverter_cost = ?, panel = ?, panel_cost = ?, panels_total_cost = ?, roof_kit = ?, roof_kit_cost = ?, annual_yield = ?, import_id = ? WHERE instance_id = ? AND elevation_spec_id = ?');

        updateStmt.setString(1, elevationSpecData.type_test_ref || rs.getString('type_test_ref'));
        updateStmt.setFloat(2, sanitizeFloat(elevationSpecData.pitch !== undefined ? elevationSpecData.pitch : rs.getFloat('pitch'))); // Sanitized pitch
        updateStmt.setString(3, elevationSpecData.orientation || rs.getString('orientation'));
        updateStmt.setFloat(4, sanitizeFloat(elevationSpecData.kk_figure !== undefined ? elevationSpecData.kk_figure : rs.getFloat('kk_figure'))); // Sanitized kk_figure
        updateStmt.setFloat(5, sanitizeFloat(elevationSpecData.kwp !== undefined ? elevationSpecData.kwp : rs.getFloat('kwp'))); // Sanitized kwp
        updateStmt.setInt(6, sanitizeInt(elevationSpecData.strings !== undefined ? elevationSpecData.strings : rs.getInt('strings')));
        updateStmt.setInt(7, sanitizeInt(elevationSpecData.module_qty !== undefined ? elevationSpecData.module_qty : rs.getInt('module_qty')));
        updateStmt.setString(8, elevationSpecData.inverter_id || rs.getString('inverter'));
        updateStmt.setFloat(9, sanitizeFloat(elevationSpecData.inverter_cost !== undefined ? elevationSpecData.inverter_cost : rs.getFloat('inverter_cost'))); // Sanitized inverter_cost
        updateStmt.setString(10, elevationSpecData.panel_id || rs.getString('panel'));
        updateStmt.setFloat(11, sanitizeFloat(elevationSpecData.panel_cost !== undefined ? elevationSpecData.panel_cost : rs.getFloat('panel_cost'))); // Sanitized panel_cost
        updateStmt.setFloat(12, sanitizeFloat(elevationSpecData.panels_total_cost !== undefined ? elevationSpecData.panels_total_cost : rs.getFloat('panels_total_cost'))); // Sanitized panels_total_cost
        updateStmt.setString(13, elevationSpecData.roof_kit_id || rs.getString('roof_kit'));
        updateStmt.setFloat(14, sanitizeFloat(elevationSpecData.roof_kit_cost !== undefined ? elevationSpecData.roof_kit_cost : rs.getFloat('roof_kit_cost'))); // Sanitized roof_kit_cost
        updateStmt.setFloat(15, sanitizeFloat(elevationSpecData.annual_yield !== undefined ? elevationSpecData.annual_yield : rs.getFloat('annual_yield'))); // Sanitized annual_yield
        updateStmt.setString(16, importId);
        updateStmt.setString(17, instanceId);
        updateStmt.setString(18, existingUuid);

        updateStmt.execute();
        console.log("Elevation spec data updated for UUID: " + existingUuid);

        // Import custom fields for the existing elevation specification
        if (elevationSpecData.customFields) {
            elevationSpecData.customFields.entityType = 'elevationSpec';
            elevationSpecData.customFields.entityId = existingUuid;
            elevationSpecData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn,instanceId, importId, elevationSpecData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for elevation specification: ' + existingUuid);
            }
        }

        return existingUuid; // Returning the existing UUID
    } else {
        // Insert new elevation spec record
        var insertStmt = conn.prepareStatement('INSERT INTO sn_elevations_spec (elevation_spec_id, instance_id, plot_spec_id, plot_id, type_test_ref, pitch, orientation, kk_figure, kwp, strings, module_qty, inverter, inverter_cost, panel, panel_cost, panels_total_cost, roof_kit, roof_kit_cost, annual_yield, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        var newUuid = Utilities.getUuid();
        insertStmt.setString(1, newUuid);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, elevationSpecData.plot_spec_id);
        insertStmt.setString(4, elevationSpecData.plot_id);
        insertStmt.setString(5, elevationSpecData.type_test_ref);
        insertStmt.setFloat(6, sanitizeFloat(elevationSpecData.pitch)); // Sanitize pitch
        insertStmt.setString(7, elevationSpecData.orientation);
        insertStmt.setFloat(8, sanitizeFloat(elevationSpecData.kk_figure)); // Sanitize kk_figure
        insertStmt.setFloat(9, sanitizeFloat(elevationSpecData.kwp)); // Sanitize kwp
        insertStmt.setInt(10, sanitizeInt(elevationSpecData.strings));
        insertStmt.setInt(11, sanitizeInt(elevationSpecData.module_qty));
        insertStmt.setString(12, elevationSpecData.inverter_id);
        insertStmt.setFloat(13, sanitizeFloat(elevationSpecData.inverter_cost)); // Sanitize inverter_cost
        insertStmt.setString(14, elevationSpecData.panel_id);
        insertStmt.setFloat(15, sanitizeFloat(elevationSpecData.panel_cost)); // Sanitize panel_cost
        insertStmt.setFloat(16, sanitizeFloat(elevationSpecData.panels_total_cost)); // Sanitize panels_total_cost
        insertStmt.setString(17, elevationSpecData.roof_kit_id);
        insertStmt.setFloat(18, sanitizeFloat(elevationSpecData.roof_kit_cost)); // Sanitize roof_kit_cost
        insertStmt.setFloat(19, sanitizeFloat(elevationSpecData.annual_yield)); // Sanitize annual_yield
        insertStmt.setString(20, importId);

        insertStmt.execute();
        console.log("New elevation spec inserted with UUID: " + newUuid);

        // Import custom fields for the new elevation specification
        if (elevationSpecData.customFields) {
            elevationSpecData.customFields.entityType = 'elevationSpec';
            elevationSpecData.customFields.entityId = newUuid;
            elevationSpecData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn,instanceId, importId, elevationSpecData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for elevation specification: ' + newUuid);
            }
        }

        return newUuid; // Returning the new UUID
    }

    rs.close();
    checkElevationSpecStmt.close();
}
