
function importRegionDetails() {
  var sheetName = "Tracker";
  var spreadSheetID = '1LxOveglR_AYMz7PnFyZrO3331vJHUoxp2AAdGcTs4LM'; // Replace with your Spreadsheet ID
  var regionColumnHeader = "Region";

  // Get region numbers from the 'Region' column
  var regionNumbers = getColumnData(regionColumnHeader, sheetName, spreadSheetID);

  // Database connection details
  var dbUrl = 'jdbc:mysql://your_mysql_host:port/your_database';
  var dbUser = 'your_username';
  var dbPassword = 'your_password';

  var conn = Jdbc.getConnection(dbUrl, dbUser, dbPassword);

  // Insert into sn_import_events using insertImportEvent function
  var importId = insertImportEvent(conn, '', 'Region Tracker', 'Importing Region details', '1'); // Assuming '1' is the user_id

  // Prepare statement for checking existing region numbers
  var checkStmt = conn.prepareStatement('SELECT COUNT(*) FROM sn_region WHERE region_number = ?');

  // Prepare statement for inserting new regions
  var insertStmt = conn.prepareStatement('INSERT INTO sn_region '
      + '(region_id, region_number, region_name, import_id) '
      + 'VALUES (?, ?, ?, ?)');

  var insertedCount = 0;

  // Mapping of region numbers to names
  var regionNames = {
    '1': 'Scotland',
    '2': 'England',
    '3': 'Wales',
    '4': 'Northern Ireland'
  };

  for (var i = 0; i < regionNumbers.length; i++) {
    var regionNumber = regionNumbers[i];

    // Check if the region number already exists
    checkStmt.setString(1, regionNumber);
    var rs = checkStmt.executeQuery();
    if (rs.next() && rs.getInt(1) == 0) { // If region number does not exist
      insertStmt.setString(1, Utilities.getUuid()); // region_id
      insertStmt.setString(2, regionNumber);        // region_number
      insertStmt.setString(3, regionNames[regionNumber]); // region_name
      insertStmt.setString(4, importId);            // use the generated import_id

      insertStmt.addBatch();
      insertedCount++;
    }
  }

  if (insertedCount > 0) {
    var batch = insertStmt.executeBatch();
    Logger.log('Inserted ' + batch.length + ' rows.');
  } else {
    Logger.log('No new regions to insert.');
  }

  conn.close();
}