function importDnoDetails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DNO-List");
  var data = sheet.getDataRange().getValues(); // Adjust range as needed

  // Database connection details
  var dbUrl = 'jdbc:mysql://your_mysql_host:port/your_database';
  var dbUser = 'your_username';
  var dbPassword = 'your_password';

  var conn = Jdbc.getConnection(dbUrl, dbUser, dbPassword);

// Insert into sn_import_events and capture the import_id
var importId = Utilities.getUuid();
var currentDate = new Date();

var importStmt = conn.prepareStatement('INSERT INTO sn_import_events (import_id, import_date, user_id, import_ref, import_source, import_notes) VALUES (?, ?, ?, ?, ?, ?)');
importStmt.setString(1, importId);
importStmt.setDate(2, currentDate); // Set the current date
importStmt.setString(3, '1'); // Assuming '1' is the user_id
importStmt.setString(4, ''); // import_ref can be left empty or filled as needed
importStmt.setString(5, 'DNO Tracker');
importStmt.setString(6, 'Importing DNO details');
importStmt.execute();

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
    stmt.setString(9, importId);            // use the captured import_id

    stmt.addBatch();
  }

  var batch = stmt.executeBatch();
  conn.close();

  Logger.log('Inserted ' + batch.length + ' rows.');
}
