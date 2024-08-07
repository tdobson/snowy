/**
 * Imports data from the "Control" sheet in the tracker spreadsheet.
 * This function imports products and users based on the data in the sheet.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} importId - The ID of the current import session.
 */
function importObsControl(conn, instanceId, importId) {
  const spreadsheet = SpreadsheetApp.openById(trackerSheetId);
  const sheet = spreadsheet.getSheetByName("Control");
  const data = sheet.getDataRange().getValues();

  // Skip the header row
  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    
    // Import products
    importProductFromControl(conn, instanceId, importId, "Inverter", row[1]);
    importProductFromControl(conn, instanceId, importId, "Panel", row[2]);
    importProductFromControl(conn, instanceId, importId, "Roof Kit", row[3]);
    importProductFromControl(conn, instanceId, importId, "Meter", row[7]);
    importProductFromControl(conn, instanceId, importId, "Optimiser", row[8]);

    // Import user
    if (row[4]) {
      importUserFromControl(conn, instanceId, importId, row[4], row[5]);
    }
  }
}

/**
 * Imports a product from the Control sheet data.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} importId - The ID of the current import session.
 * @param {string} productType - The type of the product.
 * @param {string} productName - The name of the product.
 */
function importProductFromControl(conn, instanceId, importId, productType, productName) {
  if (productName) {
    const productData = {
      productName: productName,
      productType: productType
    };
    importProductData(conn, instanceId, importId, productData);
  }
}

/**
 * Imports a user from the Control sheet data.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} importId - The ID of the current import session.
 * @param {string} name - The name of the user.
 * @param {string} dispatchId - The dispatch ID of the user.
 */
function importUserFromControl(conn, instanceId, importId, name, dispatchId) {
  const userData = {
    name: name,
    dispatch_id: dispatchId,
    category: "Human",
    company_role: "Installer",
    snowy_role: "Installer"
  };
  importUserData(conn, instanceId, importId, userData);
}
