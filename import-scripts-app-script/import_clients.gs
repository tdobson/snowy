// https://docs.google.com/spreadsheets/d//edit#gid=1873048951

function importClientDetails() {


  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Site Log");
  var data = sheet.getDataRange().getValues(); // Adjust range as needed

  // Database connection details
  var dbUrl = 'jdbc:mysql://your_mysql_host:port/your_database';
  var dbUser = 'your_username';
  var dbPassword = 'your_password';

  var conn = Jdbc.getConnection(dbUrl, dbUser, dbPassword);

  // Insert into sn_import_events and capture the import_id
  var importId = Utilities.getUuid();
  var currentDate = new Date();
  var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

  var importStmt = conn.prepareStatement('INSERT INTO sn_import_events (import_id, import_date, user_id, import_ref, import_source, import_notes) VALUES (?, ?, ?, ?, ?, ?)');
  importStmt.setString(1, importId);
  importStmt.setString(2, formattedDate); // Set the current date in the right format
  importStmt.setString(3, '1'); // Assuming '1' is the user_id
  importStmt.setString(4, ''); // import_ref can be left empty or filled as needed
  importStmt.setString(5, 'Site Log Import');
  importStmt.setString(6, 'Importing client details');
  importStmt.execute();

  var checkClientStmt = conn.prepareStatement('SELECT COUNT(*) FROM sn_clients WHERE client_name = ?');
  var checkUserStmt = conn.prepareStatement('SELECT COUNT(*) FROM sn_users WHERE email = ?');

  var clientStmt = conn.prepareStatement('INSERT INTO sn_clients (client_id, client_name, client_address_1, client_address_2, client_address_3, client_town, client_county, client_postcode, contact_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  var userStmt = conn.prepareStatement('INSERT INTO sn_users (user_id, name, email, employer, snowy_role, import_id) VALUES (?, ?, ?, ?, ?, ?)');

  for (var i = 1; i < data.length; i++) { // Skipping header row
    var clientName = data[i][2]; // Client name
    var contactEmail = data[i][23]; // Contact email

    // Check if client already exists
    checkClientStmt.setString(1, clientName);
    var clientResult = checkClientStmt.executeQuery();
    clientResult.next();
    if (clientResult.getInt(1) > 0) continue; // Skip if client exists

    // Check if user already exists
    checkUserStmt.setString(1, contactEmail);
    var userResult = checkUserStmt.executeQuery();
    userResult.next();
    if (userResult.getInt(1) > 0) continue; // Skip if user exists

    var clientUuid = Utilities.getUuid();
    var contactUuid = Utilities.getUuid();

    // Insert into sn_users
    userStmt.setString(1, contactUuid);
    userStmt.setString(2, data[i][22]); // Contact name
    userStmt.setString(3, contactEmail);
    userStmt.setString(4, clientName);
    userStmt.setString(5, 'Contact');
    userStmt.setString(6, importId);
    userStmt.addBatch();

    // Insert into sn_clients
    clientStmt.setString(1, clientUuid);
    clientStmt.setString(2, clientName);
    clientStmt.setString(3, data[i][15]); // Client address 1
    clientStmt.setString(4, data[i][16]); // Client address 2
    clientStmt.setString(5, data[i][17]); // Client address 3
    clientStmt.setString(6, data[i][18]); // Town
    clientStmt.setString(7, data[i][19]); // County
    clientStmt.setString(8, data[i][20]); // Postcode
    clientStmt.setString(9, contactUuid); // Contact ID
    clientStmt.setString(10, importId);
    clientStmt.addBatch();
  }

  // Execute batches
  userStmt.executeBatch();
  clientStmt.executeBatch();
  conn.close();

  Logger.log('Inserted client and contact details.');
}
