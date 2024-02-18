/**
 * Imports elevation specification data related to solar installations into the database. This function either updates an existing elevation specification record or inserts a new one based on the provided plot specification ID and plot ID.
 * It also ensures that associated products like inverters and panels are updated or inserted in the 'sn_products' table by calling the 'importProductData' function.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_elevations_spec' and 'sn_products' tables set up.
 *
 * Usage:
 * - Call this function with an object containing elevation specification details and a unique import ID.
 * - The function first checks if an elevation specification record for the specified plot specification ID and plot ID already exists in the database.
 * - If it exists, the function updates the existing record; otherwise, it inserts a new record with a unique UUID.
 * - Associated products like inverters and panels are updated or inserted in the 'sn_products' table using the 'importProductData' function.
 *
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
 * @param {String} importId - A unique identifier for the import session.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 *
 * @returns {String} UUID of the existing or new elevation specification record.
 *
 * Note:
 * - The function logs actions and errors to the console for tracking purposes.
 * - It's important to ensure proper error handling around database operations.
 * - This function relies on 'importProductData' to manage the insertion or updating of product-related information in the 'sn_products' table.
 */
 function importElevationSpecData(conn, importId, elevationSpecData) {
     if (!elevationSpecData.plot_spec_id || !elevationSpecData.plot_id) {
         console.log("Plot spec ID and plot ID are required.");
         return;
     }

     // Insert or update inverter and panel details in product table
     if (elevationSpecData.inverter) {
         importProductData(conn, importId,{ productName: elevationSpecData.inverter, productType: 'Inverter', costToday: elevationSpecData.inverter_cost });
     }

     if (elevationSpecData.panel) {
         importProductData(conn, importId,{ productName: elevationSpecData.panel, productType: 'Panel', costToday: elevationSpecData.panel_cost });
     }

     // Check if elevation spec data already exists
     var checkElevationSpecStmt = conn.prepareStatement('SELECT * FROM sn_elevations_spec WHERE plot_spec_id = ? AND plot_id = ?');
     checkElevationSpecStmt.setString(1, elevationSpecData.plot_spec_id);
     checkElevationSpecStmt.setString(2, elevationSpecData.plot_id);
     var rs = checkElevationSpecStmt.executeQuery();

     if (rs.next()) {
         var existingUuid = rs.getString('elevation_spec_id');
         console.log("Elevation spec already exists with UUID: " + existingUuid);

         // Update existing record
         var updateStmt = conn.prepareStatement('UPDATE sn_elevations_spec SET type_test_ref = ?, pitch = ?, orientation = ?, kk_figure = ?, kwp = ?, strings = ?, module_qty = ?, inverter = ?, inverter_cost = ?, panel = ?, panel_cost = ?, panels_total_cost = ?, roof_kit = ?, roof_kit_cost = ?, annual_yield = ?, import_id = ? WHERE elevation_spec_id = ?');

         updateStmt.setString(1, elevationSpecData.type_test_ref || rs.getString('type_test_ref'));
         updateStmt.setFloat(2, elevationSpecData.pitch !== undefined ? elevationSpecData.pitch : rs.getFloat('pitch'));
         updateStmt.setString(3, elevationSpecData.orientation || rs.getString('orientation'));
         updateStmt.setFloat(4, elevationSpecData.kk_figure !== undefined ? elevationSpecData.kk_figure : rs.getFloat('kk_figure'));
         updateStmt.setFloat(5, elevationSpecData.kwp !== undefined ? elevationSpecData.kwp : rs.getFloat('kwp'));
         updateStmt.setInt(6, elevationSpecData.strings !== undefined ? elevationSpecData.strings : rs.getInt('strings'));
         updateStmt.setInt(7, elevationSpecData.module_qty !== undefined ? elevationSpecData.module_qty : rs.getInt('module_qty'));
         updateStmt.setString(8, elevationSpecData.inverter || rs.getString('inverter'));
         updateStmt.setFloat(9, elevationSpecData.inverter_cost !== undefined ? elevationSpecData.inverter_cost : rs.getFloat('inverter_cost'));
         updateStmt.setString(10, elevationSpecData.panel || rs.getString('panel'));
         updateStmt.setFloat(11, elevationSpecData.panel_cost !== undefined ? elevationSpecData.panel_cost : rs.getFloat('panel_cost'));
         updateStmt.setFloat(12, elevationSpecData.panels_total_cost !== undefined ? elevationSpecData.panels_total_cost : rs.getFloat('panels_total_cost'));
         updateStmt.setString(13, elevationSpecData.roof_kit || rs.getString('roof_kit'));
         updateStmt.setFloat(14, elevationSpecData.roof_kit_cost !== undefined ? elevationSpecData.roof_kit_cost : rs.getFloat('roof_kit_cost'));
         updateStmt.setFloat(15, elevationSpecData.annual_yield !== undefined ? elevationSpecData.annual_yield : rs.getFloat('annual_yield'));
         updateStmt.setString(16, importId);
         updateStmt.setString(17, existingUuid);

         updateStmt.execute();
         console.log("Elevation spec data updated for UUID: " + existingUuid);

         return existingUuid; // Returning the existing UUID
     } else {
         // Insert new elevation spec record
         var insertStmt = conn.prepareStatement('INSERT INTO sn_elevations_spec (elevation_spec_id, plot_spec_id, plot_id, type_test_ref, pitch, orientation, kk_figure, kwp, strings, module_qty, inverter, inverter_cost, panel, panel_cost, panels_total_cost, roof_kit, roof_kit_cost, annual_yield, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

         var newUuid = Utilities.getUuid();
         insertStmt.setString(1, newUuid);
         insertStmt.setString(2, elevationSpecData.plot_spec_id);
         insertStmt.setString(3, elevationSpecData.plot_id);
         insertStmt.setString(4, elevationSpecData.type_test_ref);
         insertStmt.setFloat(5, elevationSpecData.pitch);
         insertStmt.setString(6, elevationSpecData.orientation);
         insertStmt.setFloat(7, elevationSpecData.kk_figure);
         insertStmt.setFloat(8, elevationSpecData.kwp);
         insertStmt.setInt(9, elevationSpecData.strings);
         insertStmt.setInt(10, elevationSpecData.module_qty);
         insertStmt.setString(11, elevationSpecData.inverter);
         insertStmt.setFloat(12, elevationSpecData.inverter_cost);
         insertStmt.setString(13, elevationSpecData.panel);
         insertStmt.setFloat(14, elevationSpecData.panel_cost);
         insertStmt.setFloat(15, elevationSpecData.panels_total_cost);
         insertStmt.setString(16, elevationSpecData.roof_kit);
         insertStmt.setFloat(17, elevationSpecData.roof_kit_cost);
         insertStmt.setFloat(18, elevationSpecData.annual_yield);
         insertStmt.setString(19, importId);

         insertStmt.execute();
         console.log("New elevation spec inserted with UUID: " + newUuid);

         return newUuid; // Returning the new UUID
     }

     rs.close();
     checkElevationSpecStmt.close();
 }

