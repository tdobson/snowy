/**
 * Imports client and contact details from a Google Sheets spreadsheet named "Site Log" into a MySQL database.
 * The function reads each row from the sheet, converts it into an object using rowDataToObject, checks for existing
 * client, user, and address records in the database to avoid duplicates, and logs an import event. It inserts or updates data
 * into the 'sn_clients', 'sn_users', and 'sn_addresses' tables.
 *
 * Prerequisites:
 * - Google Sheets document with a sheet named "Site Log" containing client and contact details.
 * - MySQL database with 'sn_import_events', 'sn_clients', 'sn_users', and 'sn_addresses' tables set up.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Run this function to import data from the "Site Log" sheet into the database.
 *
 * Notes:
 * - Skips the header row and starts processing data from the second row.
 * - Uses rowDataToObject utility function for row data conversion.
 * - Uses prepared statements for database operations.
 * - Exception handling should be implemented as needed.
 *
 * @returns {void}
 */
function importClientDetails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Site Log");
  var data = sheet.getDataRange().getValues();

  var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
  var importId = insertImportEvent(conn, '', 'Site Log Import', 'Importing client and contact details', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

  var checkClientStmt = conn.prepareStatement('SELECT * FROM sn_clients WHERE client_name = ?');
  var insertClientStmt = conn.prepareStatement('INSERT INTO sn_clients (client_id, client_name, address_id, contact_id, import_id) VALUES (?, ?, ?, ?, ?)');
  var updateClientStmt = conn.prepareStatement('UPDATE sn_clients SET address_id = ?, contact_id = ? WHERE client_name = ?');

  for (var i = 1; i < data.length; i++) {
    var rowData = rowDataToObject(sheet, i + 1, 1, sheet.getLastColumn());

    var userData = {
      name: rowData['Contact_name'],
      email: rowData['Contact_Email'],
      employer: rowData.client,
      snowy_role: "Client",
      category: "Human"
    };

    var addressData = {
      address_line_1: rowData['Client_address_1'],
      address_line_2: rowData['client_address_2'],
      address_line_3: rowData['client_address_3'],
      address_town: rowData['Town'],
      address_county: rowData['County'],
      address_postcode: rowData['Post_Code']
    };

    var userId = importUserData(userData, importId, conn);
    var addressId = importAddressData(addressData, importId, conn);

    // Check and insert/update client data
    checkClientStmt.setString(1, rowData.client);
    var clientResult = checkClientStmt.executeQuery();
    if (clientResult.next()) {
      updateClientStmt.setString(1, addressId);
      updateClientStmt.setString(2, userId);
      updateClientStmt.setString(3, rowData.client);
      updateClientStmt.execute();
    } else {
      var clientUuid = Utilities.getUuid();
      insertClientStmt.setString(1, clientUuid);
      insertClientStmt.setString(2, rowData.client);
      insertClientStmt.setString(3, addressId);
      insertClientStmt.setString(4, userId);
      insertClientStmt.setString(5, importId);
      insertClientStmt.execute();
    }
  }

  conn.close();
  Logger.log('Client and contact details import/update complete.');
}