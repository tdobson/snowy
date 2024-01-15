/**
 * Retrieves the region number corresponding to a given PV number from a Google Sheets spreadsheet.
 *
 * @param {string} pvNumber - The PV number to search for in the spreadsheet.
 * @returns {string} The region number corresponding to the given PV number. Returns an empty string if not found.
 */
function getRegionByPVNumber(sheet,pvNumber) {
  // If pvNumber is blank or not provided, immediately return an empty string
  if (!pvNumber || pvNumber.trim() === "") {
    return "";
  }
    var spreadsheet = sheet.getParent();
    var spreadsheetId = spreadsheet.getId();

  var sheetName = 'Tracker'; // Name of the sheet where the data is located
  var searchColumnName = 'PV NO'; // The column name where the PV number is located
  var returnColumnName = 'REGION'; // The column name for the region number

  try {
    // Call the function to search for the PV number and return the corresponding region number
    var regionNumber = findValueInSheet(spreadsheetId, sheetName, searchColumnName, returnColumnName, pvNumber);

    // Check if a region number is found, otherwise return an empty string
    return regionNumber ? regionNumber : "";
  } catch (error) {
    console.error("Error in getRegionByPVNumber: " + error.message);
    return "";
  }
}
/**
 * Fetches the region_id corresponding to a given region number from the sn_region table in a MySQL database.
 * Returns an empty string immediately if no result is found or if the region number is not provided.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_region' table set up and containing records.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Call this function with a region number to fetch the corresponding region_id from the database.
 *
 * @param {number} regionNumber - The region number to look up in the database.
 * @returns {string} The region_id corresponding to the provided region number or an empty string if not found.
 */
function getRegionIdFromRegionNumber(regionNumber) {
  // Immediately return an empty string if regionNumber is not provided or is blank
  if (!regionNumber || regionNumber.toString().trim() === "") {
    return "";
  }

  var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);

  var stmt = conn.prepareStatement('SELECT region_id FROM sn_region WHERE region_number = ?');
  stmt.setString(1, regionNumber.toString());
  var rs = stmt.executeQuery();

  var regionId = '';
  if (rs.next()) {
    regionId = rs.getString('region_id');
  } else {
    regionId = ""; // Return an empty string if no matching region_id is found
  }

  rs.close();
  stmt.close();
  conn.close();

  return regionId;
}
