/**
 * Imports data from the "Control" sheet in the tracker spreadsheet.
 * This function imports products, users, jobs, and slots based on the data in the sheet.
 *
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {string} instanceId - The ID of the instance.
 * @param {string} importId - The ID of the current import session.
 */
function importObsControl(conn, instanceId, importId) {
  const spreadsheet = SpreadsheetApp.openById(trackerSheetId);
  const sheet = spreadsheet.getSheetByName("Control");
  const data = sheet.getDataRange().getValues();

  // Get product types from the first row (index 0)
  const productTypes = {
    inverter: data[0][1],
    panel: data[0][2],
    roofKit: data[0][3],
    meter: data[0][7],
    optimiser: data[0][8]
  };

  // Start from row 2 (index 1) to skip header
  for (let i = 2; i < data.length; i++) {
    const columns = data[i];
    
    // Import products
    importProductFromControl(conn, instanceId, importId, productTypes.inverter, columns[1]);
    importProductFromControl(conn, instanceId, importId, productTypes.panel, columns[2]);
    importProductFromControl(conn, instanceId, importId, productTypes.roofKit, columns[3]);
    importProductFromControl(conn, instanceId, importId, productTypes.meter, columns[7]);
    importProductFromControl(conn, instanceId, importId, productTypes.optimiser, columns[8]);

    // Import user
    if (columns[4]) {
      importUserFromControl(conn, instanceId, importId, columns[4], columns[5]);
    }

    // Import job
    const jobData = {
      jobType: columns[0],
      projectNumber: columns[3],
      plotNumber: columns[4],
      address: columns[5],
      notes: columns[6],
      eventId: columns[15],
      installer: columns[16],
      dispatchId: columns[17],
      completed: columns[18],
      dateCompleted: columns[19],
      site: columns[21],
      client: columns[22],
      postCode: columns[23]
    };
    importJobData(conn, instanceId, importId, jobData);

    // Import slot
    const slotData = {
      date: columns[1],
      slotNumber: columns[2],
      jobId: '' // This will be set in the importSlotData function
    };
    importSlotData(conn, instanceId, importId, slotData);
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
  if (productName && productName !== "Select Option") {
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
  if (name !== "Select Installer") {
    const userData = {
      name: name,
      dispatch_id: dispatchId,
      category: "Human",
      company_role: "Installer",
      snowy_role: "Installer"
    };
    importUserData(conn, instanceId, importId, userData);
  }
}
