
/**
 * Imports product data into the database and either updates an existing product or inserts a new one based on the product name, which must be unique.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_products' table set up.
 *
 * Usage:
 * - Call this function with an object containing product details and a unique import ID.
 * - The function checks if a product with the same name already exists in the database.
 * - If it exists, the function updates the existing record; otherwise, it inserts a new record with a unique UUID.
 *
 * @param {Object} productData - An object containing the product details. Expected keys:
 *   - productName: String - Mandatory. The name of the product (must be unique).
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
 * @param {String} importId - A unique identifier for the import session.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 *
 * @returns {String} UUID of the existing or new product record.
 *
 * Note:
 * - The function logs actions and errors to the console for tracking purposes.
 * - It's important to ensure proper error handling around database operations.
 */
function importProductData(productData, importId, conn) {
  if (!productData.productName) {
    console.log("Product name is required.");
    return;
  }

  var checkProductStmt = conn.prepareStatement('SELECT * FROM sn_products WHERE product_name = ?');
  checkProductStmt.setString(1, productData.productName);
  var rs = checkProductStmt.executeQuery();

  if (rs.next()) {
    var existingUuid = rs.getString('product_id');
    console.log("Product already exists with UUID: " + existingUuid);

    // Optionally update existing record if any field is blank
    var updateStmt = conn.prepareStatement('UPDATE sn_products SET product_type = ?, manufacturer = ?, product_model = ?, kwp = ?, voc = ?, isc = ?, type = ?, capacity = ?, no_phases = ?, model_ref = ?, cost_today = ?, mcs_product_reference = ?, mcs_product_id = ?, import_id = ? WHERE product_id = ?');

    updateStmt.setString(1, productData.productType || rs.getString('product_type'));
    updateStmt.setString(2, productData.manufacturer || rs.getString('manufacturer'));
    updateStmt.setString(3, productData.productModel || rs.getString('product_model'));
    updateStmt.setFloat(4, productData.kwp !== undefined ? productData.kwp : rs.getFloat('kwp'));
    updateStmt.setFloat(5, productData.voc !== undefined ? productData.voc : rs.getFloat('voc'));
    updateStmt.setFloat(6, productData.isc !== undefined ? productData.isc : rs.getFloat('isc'));
    updateStmt.setString(7, productData.type || rs.getString('type'));
    updateStmt.setFloat(8, productData.capacity !== undefined ? productData.capacity : rs.getFloat('capacity'));
    updateStmt.setInt(9, productData.noPhases !== undefined ? productData.noPhases : rs.getInt('no_phases'));
    updateStmt.setString(10, productData.modelRef || rs.getString('model_ref'));
    updateStmt.setFloat(11, productData.costToday !== undefined ? productData.costToday : rs.getFloat('cost_today'));
    updateStmt.setString(12, productData.mcsProductReference || rs.getString('mcs_product_reference'));
    updateStmt.setString(13, productData.mcsProductId || rs.getString('mcs_product_id'));
    updateStmt.setString(14, importId);
    updateStmt.setString(15, existingUuid);

    updateStmt.execute();
    console.log("Product data updated for UUID: " + existingUuid);

    return existingUuid; // Returning the existing UUID
  } else {
    var insertStmt = conn.prepareStatement('INSERT INTO sn_products (product_id, product_type, manufacturer, product_model, product_name, kwp, voc, isc, type, capacity, no_phases, model_ref, cost_today, mcs_product_reference, mcs_product_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    var newUuid = Utilities.getUuid();
    insertStmt.setString(1, newUuid);
    insertStmt.setString(2, productData.productType);
    insertStmt.setString(3, productData.manufacturer);
    insertStmt.setString(4, productData.productModel);
    insertStmt.setString(5, productData.productName);
    insertStmt.setFloat(6, productData.kwp);
    insertStmt.setFloat(7, productData.voc);
    insertStmt.setFloat(8, productData.isc);
    insertStmt.setString(9, productData.type);
    insertStmt.setFloat(10, productData.capacity);
    insertStmt.setInt(11, productData.noPhases);
    insertStmt.setString(12, productData.modelRef);
    insertStmt.setFloat(13, productData.costToday);
    insertStmt.setString(14, productData.mcsProductReference);
    insertStmt.setString(15, productData.mcsProductId);
    insertStmt.setString(16, importId);

    insertStmt.execute();
    console.log("New product inserted with UUID: " + newUuid);

    return newUuid; // Returning the new UUID
  }

  rs.close();
  checkProductStmt.close();
}
