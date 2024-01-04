/**
 * Imports or updates Distribution Network Operator (DNO) details into the sn_dno_details table in the database
 * from a Google Sheets spreadsheet named "DNO-List". The function reads each row from the sheet,
 * checks if a DNO with the given MPAN prefix already exists in the database, and either inserts a new record
 * or updates the existing one. Fields in the database are updated only if they are blank and new data is available.
 * An import event is logged in the sn_import_events table each time the function is run.
 *
 * Prerequisites:
 * - A Google Sheets spreadsheet with a sheet named "DNO-List" must exist.
 * - The spreadsheet should contain DNO details with columns for MPAN Prefix, DNO Name, Address, Email Address,
 *   Contact Number, Internal Telephone, and Type.
 * - The database should have sn_dno_details and sn_import_events tables set up.
 *
 * Usage:
 * - Call this function to import or update DNO details from the "DNO-List" sheet in the active Google Spreadsheet.
 * - Ensure the database connection details (GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD) are correctly set.
 *
 * Notes:
 * - The function assumes that the MPAN Prefix column is unique for each DNO.
 * - The function skips the header row and starts processing data from the second row.
 * - The rowDataToObject utility function is used to convert each row's data into an object.
 * - The insertImportEvent function is used to log the import event.
 * - A Jdbc connection is used for database operations.
 * - If a DNO with the same MPAN Prefix is found, it updates the record only if the new data is not empty and the existing data is empty.
 * - If no existing DNO is found, a new record is inserted.
 * - The function logs completion of the import/update process.
 *
 * @param {Object} rowData - Row data object containing DNO details.
 * @returns {void}
 */
function importDnoDetails() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DNO-List");
    var data = sheet.getDataRange().getValues(); // Get data from the sheet

    // Database connection details
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);

    // Insert into sn_import_events using insertImportEvent function
    var importId = insertImportEvent(conn, '', 'DNO Tracker', 'Importing DNO details', '4df57691-4d43-4cfb-9338-00e4cfafa63d'); // Replace 'user_id_here' with actual user ID

    var checkDnoStmt = conn.prepareStatement('SELECT * FROM sn_dno_details WHERE mpan_prefix = ?');
    var insertDnoStmt = conn.prepareStatement('INSERT INTO sn_dno_details (dno_details_id, mpan_prefix, dno_name, address, email_address, contact_no, internal_tel, type, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    var updateDnoStmt = conn.prepareStatement('UPDATE sn_dno_details SET dno_name = ?, address = ?, email_address = ?, contact_no = ?, internal_tel = ?, type = ? WHERE mpan_prefix = ?');

    for (var i = 1; i < data.length; i++) { // Skipping header row
        var rowData = rowDataToObject(sheet, i + 1, 1, sheet.getLastColumn()); // Convert row data to object
        // Check if DNO with given MPAN prefix exists
        checkDnoStmt.setString(1, rowData.MPAN_Prefix);
        var rs = checkDnoStmt.executeQuery();

        if (rs.next()) {
            // Update existing record if any field is blank
            updateDnoStmt.setString(1, rowData.DNO_NAME || rs.getString('dno_name'));
            updateDnoStmt.setString(2, rowData.ADDRESS || rs.getString('address'));
            updateDnoStmt.setString(3, rowData.EMAIL_ADDRESS || rs.getString('email_address'));
            updateDnoStmt.setString(4, rowData.CONTACT_NO || rs.getString('contact_no'));
            updateDnoStmt.setString(5, rowData.INTERNAL_TEL || rs.getString('internal_tel'));
            updateDnoStmt.setString(6, rowData.TYPE || rs.getString('type'));
            updateDnoStmt.setString(7, rowData.MPAN_Prefix);
            updateDnoStmt.execute();
        } else {
            // Insert new record
            console.log(rowData.MPAN_Prefix)
            insertDnoStmt.setString(1, Utilities.getUuid());
            insertDnoStmt.setString(2, rowData.MPAN_Prefix);
            insertDnoStmt.setString(3, rowData.DNO_NAME);
            insertDnoStmt.setString(4, rowData.ADDRESS);
            insertDnoStmt.setString(5, rowData.EMAIL_ADDRESS);
            insertDnoStmt.setString(6, rowData.CONTACT_NO);
            insertDnoStmt.setString(7, rowData.INTERNAL_TEL);
            insertDnoStmt.setString(8, rowData.TYPE);
            insertDnoStmt.setString(9, importId);
            insertDnoStmt.execute();
        }
    }

    conn.close();
    Logger.log('DNO details import/update complete.');
}
