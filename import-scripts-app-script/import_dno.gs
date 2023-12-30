function importDnoDetails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DNO-List");
  var data = sheet.getDataRange().getValues(); // Adjust range as needed

  // Database connection details
  var dbUrl = 'jdbc:mysql://your_mysql_host:port/your_database';
  var dbUser = 'your_username';
  var dbPassword = 'your_password';

  var conn = Jdbc.getConnection(dbUrl, dbUser, dbPassword);

  // Insert into sn_import_events using insertImportEvent function
  var importId = insertImportEvent(conn, '', 'DNO Tracker', 'Importing DNO details', '1'); // Assuming '1' is the user_id

  // Prepare statement for sn_dno_details
  var stmt = conn.prepareStatement('INSERT INTO sn_dno_details '
      + '(dno_details_id, mpan_prefix, dno_name, address, email_address, contact_no, internal_tel, type, import_id) '
      + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

  for (var i = 1; i < data.length; i++) { // Skipping header row
    stmt.setString(1, Utilities.getUuid()); // dno_details_id
    stmt.setInt(2, data[i][0]);             // mpan_prefix
    stmt.setString(3, data[i][1]);          // dno_name
    stmt.setString(4, data[i][2]);          // address
    stmt.setString(5, data[i][3]);          // email_address
    stmt.setString(6, data[i][4]);          // contact_no
    stmt.setString(7, data[i][5]);          // internal_tel
    stmt.setString(8, data[i][6]);          // type
    stmt.setString(9, importId);            // use the generated import_id

    stmt.addBatch();
  }

  var batch = stmt.executeBatch();
  conn.close();

  Logger.log('Inserted ' + batch.length + ' rows.');
}
