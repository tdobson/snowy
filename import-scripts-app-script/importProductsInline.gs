/**
 * Imports product data into the database and either updates an existing product or inserts a new one based on the product name, which must be unique.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_products' and 'sn_instances' tables set up.
 *
 * Usage:
 * - Call this function with an active JDBC connection, an instance ID, a unique import ID, and an object containing product details.
 * - The function checks if a product with the same name already exists in the database for the given instance.
 * - If it exists, the function updates the existing record; otherwise, it inserts a new record with a unique UUID.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} instanceId - The unique identifier for the customer instance.
 * @param {String} importId - A unique identifier for the import session.
 * @param {Object} productData - An object containing the product details. Expected keys:
 *   - productName: String - Mandatory. The name of the product (must be unique for the instance).
 *   - productType: String - Optional. The type of the product (e.g., Roof Kit, Panel, Battery, Inverter).
 *   - manufacturer: String - Optional. The manufacturer's name.
 *   - productModel: String - Optional. The model of the product.
 *   - kwp: Float - Optional. Kilowatt-peak of the product.
 *   - voc: Float - Optional. Open circuit voltage (VOC) of the product.
 *   - isc: Float - Optional. Short circuit current (ISC) of the product.
 *   - type: String - Optional. Another field to specify the product type.
 *   - capacity: Float - Optional. Capacity of the product.
 *   - noPhases: Integer - Optional. Number of phases.
 *   - modelRef: String - Optional. A reference to the product model.
 *   - costToday: Float - Optional. The current cost of the product.
 *   - mcsProductReference: String - Optional. MCS certification reference number.
 *   - mcsProductId: String - Optional. MCS certification code.
 *   - customFields - Custom fields data for the product. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For product custom fields, this should be 'product'.
 *     - {string} entityId - The UUID of the specific product instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
 *
 * @returns {String} UUID of the existing or new product record.
 *
 * Note:
 * - The function logs actions and errors to the console for tracking purposes.
 * - It's important to ensure proper error handling around database operations.
 */
function importProductData(conn, instanceId, importId, productData) {
    if (!productData.productName) {
        console.log("Product name is required.");
        return;
    }

    // Check if the product already exists for the given instance
    var checkProductStmt = conn.prepareStatement('SELECT * FROM sn_products WHERE product_name = ? AND instance_id = ?');
    checkProductStmt.setString(1, productData.productName);
    checkProductStmt.setString(2, instanceId);
    var rs = checkProductStmt.executeQuery();

    if (rs.next()) {
        var existingUuid = rs.getString('product_id');
        console.log("Product already exists with UUID: " + existingUuid);

        // Optionally update existing record if any field is blank
        var updateStmt = conn.prepareStatement('UPDATE sn_products SET product_type = ?, manufacturer = ?, product_model = ?, kwp = ?, voc = ?, isc = ?, type = ?, capacity = ?, no_phases = ?, model_ref = ?, cost_today = ?, mcs_product_reference = ?, mcs_product_id = ?, import_id = ? WHERE product_id = ? AND instance_id = ?');

        updateStmt.setString(1, productData.productType || rs.getString('product_type'));
        updateStmt.setString(2, productData.manufacturer || rs.getString('manufacturer'));
        updateStmt.setString(3, productData.productModel || rs.getString('product_model'));
        updateStmt.setFloat(4, sanitizeFloat(productData.kwp !== undefined ? productData.kwp : rs.getFloat('kwp')));
        updateStmt.setFloat(5, sanitizeFloat(productData.voc !== undefined ? productData.voc : rs.getFloat('voc')));
        updateStmt.setFloat(6, sanitizeFloat(productData.isc !== undefined ? productData.isc : rs.getFloat('isc')));
        updateStmt.setString(7, productData.type || rs.getString('type'));
        updateStmt.setFloat(8, sanitizeFloat(productData.capacity !== undefined ? productData.capacity : rs.getFloat('capacity')));
        updateStmt.setInt(9, convertPhaseToInt(productData.noPhases !== undefined ? productData.noPhases : rs.getInt('no_phases')));
        updateStmt.setString(10, productData.modelRef || rs.getString('model_ref'));
        updateStmt.setFloat(11, sanitizeFloat(productData.costToday !== undefined ? productData.costToday : rs.getFloat('cost_today')));
        updateStmt.setString(12, productData.mcsProductReference || rs.getString('mcs_product_reference'));
        updateStmt.setString(13, productData.mcsProductId || rs.getString('mcs_product_id'));
        updateStmt.setString(14, importId);
        updateStmt.setString(15, existingUuid);
        updateStmt.setString(16, instanceId);

        updateStmt.execute();
        console.log("Product data updated for UUID: " + existingUuid);

        // Import custom fields for the existing product
        if (productData.customFields) {
            productData.customFields.entityType = 'product';
            productData.customFields.entityId = existingUuid;
            productData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, productData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for product: ' + existingUuid);
            }
        }

        return existingUuid; // Returning the existing UUID
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_products (product_id, instance_id, product_type, manufacturer, product_model, product_name, kwp, voc, isc, type, capacity, no_phases, model_ref, cost_today, mcs_product_reference, mcs_product_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        var newUuid = Utilities.getUuid();
        insertStmt.setString(1, newUuid);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, productData.productType);
        insertStmt.setString(4, productData.manufacturer);
        insertStmt.setString(5, productData.productModel);
        insertStmt.setString(6, productData.productName);
        insertStmt.setFloat(7, sanitizeFloat(productData.kwp));
        insertStmt.setFloat(8, sanitizeFloat(productData.voc));
        insertStmt.setFloat(9, sanitizeFloat(productData.isc));
        insertStmt.setString(10, productData.type);
        insertStmt.setFloat(11, sanitizeFloat(productData.capacity));
        insertStmt.setInt(12, convertPhaseToInt(productData.noPhases));
        insertStmt.setString(13, productData.modelRef);
        insertStmt.setFloat(14, sanitizeFloat(productData.costToday));
        insertStmt.setString(15, productData.mcsProductReference);
        insertStmt.setString(16, productData.mcsProductId);
        insertStmt.setString(17, importId);

        insertStmt.execute();
        console.log("New product inserted with UUID: " + newUuid);

        // Import custom fields for the new product
        if (productData.customFields) {
            productData.customFields.entityType = 'product';
            productData.customFields.entityId = newUuid;
            productData.customFields.instanceId = instanceId;
            var customFieldsImported = importCustomFields(conn, instanceId, importId, productData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for product: ' + newUuid);
            }
        }

        return newUuid; // Returning the new UUID
    }

    rs.close();
    checkProductStmt.close();
}
