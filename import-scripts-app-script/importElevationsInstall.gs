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
      elevationData.inverter_id =   importProductData(conn, instanceId,importId, { productName: elevationData.inverter, productType: 'Inverter', costToday: elevationData.inverter_cost, manufacturer: elevationSpecData.inverter_manufacturer });
    }

    if (elevationData.panel) {
      elevationData.panel_id =   importProductData(conn, instanceId, importId, { productName: elevationData.panel, productType: 'Panel', costToday: elevationData.panel_cost });
    }

            if (elevationData.roofkit) {
              elevationData.roofkit_id =   importProductData(conn,instanceId, importId, { productName: elevationData.roof_kit, productType: 'Roof Kit' });
            }

// Determine the elevation number for the current elevation installation
var elevationNumberStmt = conn.prepareStatement(`
    -- Check if a custom field value already exists for the elevation installation
    SELECT field_value INTO @existing_elevation_number
    FROM sn_custom_fields
    WHERE entity_type = 'elevationInstall'
      AND entity_id = ?
      AND field_name = 'Elevation_No';

    -- If a custom field value exists, use it as the elevation number
    IF @existing_elevation_number IS NOT NULL THEN
        SET @elevation_number = @existing_elevation_number;
    ELSE
        -- Check if a custom field value already exists for the elevation installation with 'elevation_number' field name
        SELECT field_value INTO @existing_elevation_number
        FROM sn_custom_fields
        WHERE entity_type = 'elevationInstall'
          AND entity_id = ?
          AND field_name = 'elevation_number';

        -- If a custom field value exists, use it as the elevation number
        IF @existing_elevation_number IS NOT NULL THEN
            SET @elevation_number = @existing_elevation_number;
        ELSE
            -- If a custom field value doesn't exist, determine the elevation number based on import date
            SELECT COUNT(*) + 1 INTO @elevation_number
            FROM sn_elevations_install ei
            INNER JOIN sn_import_events ie ON ei.import_id = ie.import_id
            WHERE ei.instance_id = ?
              AND ei.plot_id = ?
              AND (
                ie.import_date < (
                  SELECT ie2.import_date
                  FROM sn_elevations_install ei2
                  INNER JOIN sn_import_events ie2 ON ei2.import_id = ie2.import_id
                  WHERE ei2.elevation_install_id = ?
                )
                OR (
                  ie.import_date = (
                    SELECT ie2.import_date
                    FROM sn_elevations_install ei2
                    INNER JOIN sn_import_events ie2 ON ei2.import_id = ie2.import_id
                    WHERE ei2.elevation_install_id = ?
                  )
                  AND ei.elevation_install_id <= ?
                )
              );
        END IF;
    END IF;

    -- Return the elevation number
    SELECT @elevation_number AS elevation_number;
`);

var checkElevationStmt = conn.prepareStatement("SELECT * FROM sn_plots p JOIN sn_plot_install pi ON p.plot_id = pi.plot_id JOIN sn_elevations_install ei ON pi.plot_install_id = ei.plot_install_id JOIN sn_custom_fields elevationno ON ei.elevation_install_id = elevationno.entity_id AND elevationno.entity_type = 'elevationInstall' AND elevationno.field_name = 'Elevation_No' JOIN sn_custom_fields variationfromsouth ON ei.elevation_install_id = variationfromsouth.entity_id AND variationfromsouth.entity_type = 'elevationInstall' AND variationfromsouth.field_name = 'Input_Variation_from_South' WHERE p.instance_id = ? AND p.plot_id = ? AND ei.plot_install_id = ? AND pitch = ? AND orientation = ? AND elevationno.field_value = ? AND type_test_ref = ? AND module_qty = ? AND variationfromsouth.field_value = ?");
checkElevationStmt.setString(1, instanceId);
checkElevationStmt.setString(2, elevationData.plot_id);
checkElevationStmt.setString(3, elevationData.plot_install_id);
checkElevationStmt.setFloat(4, sanitizeFloat(elevationData.pitch));
checkElevationStmt.setString(5, sanitizeString(elevationData.orientation));
checkElevationStmt.setString(6, elevationData.customFields.fields.Elevation_No);
checkElevationStmt.setString(7, elevationData.type_test_ref);
checkElevationStmt.setString(8, elevationData.module_qty);
checkElevationStmt.setString(9, elevationData.customFields.fields.Input_Variation_from_South);
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
        updateStmt.setString(8, elevationData.inverter_id || rs.getString('inverter'));
        updateStmt.setFloat(9, sanitizeFloat(elevationData.inverter_cost !== undefined ? elevationData.inverter_cost : rs.getFloat('inverter_cost'))); // Sanitized inverter_cost
        updateStmt.setString(10, elevationData.panel_id || rs.getString('panel'));
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
        insertStmt.setString(12, elevationData.inverter_id);
        insertStmt.setFloat(13, sanitizeFloat(elevationData.inverter_cost)); // Sanitized inverter_cost
        insertStmt.setString(14, elevationData.panel_id);
        insertStmt.setFloat(15, sanitizeFloat(elevationData.panel_cost)); // Sanitized panel_cost
        insertStmt.setFloat(16, sanitizeFloat(elevationData.panels_total_cost)); // Sanitized panels_total_cost
        insertStmt.setString(17, elevationData.roof_kit);
        insertStmt.setFloat(18, sanitizeFloat(elevationData.roof_kit_cost)); // Sanitized roof_kit_cost
        insertStmt.setFloat(19, sanitizeFloat(elevationData.annual_yield)); // Sanitized annual_yield
        insertStmt.setString(20, importId);

        insertStmt.execute();
        console.log("New elevation installed with UUID: " + newUuid);

elevationNumberStmt.setString(1, newUuid);
elevationNumberStmt.setString(2, newUuid);
elevationNumberStmt.setString(3, instanceId);
elevationNumberStmt.setString(4, elevationData.plot_id);
elevationNumberStmt.setString(5, newUuid);
elevationNumberStmt.setString(6, newUuid);
elevationNumberStmt.setString(7, newUuid);

var elevationNumberRs = elevationNumberStmt.executeQuery();
if (elevationNumberRs.next()) {
    elevationData.customFields.fields.elevationNumber = elevationNumberRs.getInt('elevation_number');
}
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
