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
 function importDnoDetails(conn, importId,sheet) {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DNO-List");
       var data = sheet.getDataRange().getValues();

       var checkDnoStmt = conn.prepareStatement('SELECT * FROM sn_dno_details WHERE mpan_prefix = ?');
       var insertDnoStmt = conn.prepareStatement('INSERT INTO sn_dno_details (dno_details_id, mpan_prefix, dno_name, address, email_address, contact_no, internal_tel, type, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
       var updateDnoStmt = conn.prepareStatement('UPDATE sn_dno_details SET dno_name = ?, address = ?, email_address = ?, contact_no = ?, internal_tel = ?, type = ? WHERE mpan_prefix = ?');

       var returnedUuid = null; // Initialize with null

       for (var i = 1; i < data.length; i++) {
           var rowData = rowDataToObject(sheet, i + 1, 1, sheet.getLastColumn());
           checkDnoStmt.setString(1, rowData.MPAN_Prefix);
           var rs = checkDnoStmt.executeQuery();

           if (rs.next()) {
               var existingUuid = rs.getString('dno_details_id');
               returnedUuid = existingUuid;

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
               var newUuid = Utilities.getUuid();
               returnedUuid = newUuid;

               // Insert new record
               insertDnoStmt.setString(1, newUuid);
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
       return returnedUuid; // Return the UUID of the new or existing record
   }


/**
 * Looks up Distribution Network Operator (DNO) details by MPAN ID in the sn_dno_details table in the database.
 *
 * @param {string} mpanId - The MPAN ID to look up.
 * @returns {Object|null} - The DNO details if found, or null if not found.
 */
function lookupDnoDetailsByMpan(conn, mpanId) {

    try {
        var checkDnoStmt = conn.prepareStatement('SELECT * FROM sn_dno_details WHERE mpan_prefix = ?');
        checkDnoStmt.setString(1, mpanId);

        var rs = checkDnoStmt.executeQuery();

        if (rs.next()) {
            var dnoDetails = {
                'dno_details_id': rs.getString('dno_details_id'),
                'mpan_prefix': rs.getString('mpan_prefix'),
                'dno_name': rs.getString('dno_name'),
                'address': rs.getString('address'),
                'email_address': rs.getString('email_address'),
                'contact_no': rs.getString('contact_no'),
                'internal_tel': rs.getString('internal_tel'),
                'type': rs.getString('type'),
            };

            return dnoDetails.dno_details_id;
        } else {
            return null; // DNO not found for the given MPAN ID
        }
    } catch (e) {
        Logger.log('Error in lookupDnoDetailsByMpan: ' + e);
        return null; // Handle any database errors gracefully
    } finally {
       // conn.close();
    }
}
