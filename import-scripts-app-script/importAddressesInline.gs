
/**
 * Imports address data into a MySQL database and either updates an existing address or inserts a new one.
 * Additionally, it can fetch and set the region ID for an address based on a provided PV number.
 * If the address already exists in the database, it updates the record; otherwise, it inserts a new record with a unique UUID.
 *
 * Prerequisites:
 * - A MySQL database with the 'sn_addresses' table set up.
 * - The 'getRegionByPVNumber' and 'getRegionIdFromRegionNumber' functions must be defined and functional.
 *
 * Usage:
 * - Call this function with an object containing address details, a unique import ID, a database connection,
 *   a Sheet object, and an optional PV number.
 * - The function checks the address against the database using the address line 1 and postcode.
 * - If a PV number is provided, the function attempts to fetch the corresponding region number and region ID.
 * - If the address exists, the function updates it; otherwise, it inserts a new address.
 *
 * @param {Object} addressData - An object containing the address details. Expected keys:
 *   - address_line_1: String - Mandatory. The first line of the address.
 *   - address_line_2: String - Optional. The second line of the address.
 *   - address_town: String - Optional. The town of the address.
 *   - address_county: String - Optional. The county of the address.
 *   - address_postcode: String - Mandatory. The postcode of the address.
 *   - address_country: String - Optional. The country of the address.
 *   - address_region_id: String - Optional. Region identifier (updated based on PV number if provided).
 *   - address_region_number: String - Optional. Looks up region_id based on this if it exists.
 * @param {String} importId - A unique identifier for the import session.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {Sheet} sheet - The Google Sheets Sheet object (used if PV number is provided).
 * @param {String} [pvNumber] - Optional. The PV number used to determine the region ID.
 *
 * @returns {String} UUID of the existing or new address record.
 *
 * Note:
 * - The function logs actions and errors to the console for tracking purposes.
 * - It's important to ensure proper error handling around database operations.
 */
function importAddress(conn, importId, addressData, sheet, pvNumber) {
  if (!addressData.address_line_1 || !addressData.address_postcode) {
    console.log("Address line 1 and postcode are required.");
    return;
  }

  // Declare regionId once at the top
  var regionId;

  // Check if address_region_number is provided and use it to get regionId
  if (addressData.address_region_number) {
    try {
      regionId = getRegionIdFromRegionNumber(conn, addressData.address_region_number);
      if (regionId) {
        addressData.address_region_id = regionId;
      }
    } catch (error) {
      console.log("Couldn't get region ID from address_region_number: " + error.message);
    }
  } else if (pvNumber) {
    // If pvNumber is provided, use it to get regionNumber and then regionId
    try {
      var regionNumber = getRegionByPVNumber(sheet, pvNumber);
      regionId = getRegionIdFromRegionNumber(conn, regionNumber);
      if (regionId) {
        addressData.address_region_id = regionId;
      }
    } catch (error) {
      console.log("Couldn't get region ID from PV number: " + error.message);
    }
  }

  var checkAddressStmt = conn.prepareStatement('SELECT * FROM sn_addresses WHERE address_line_1 = ? AND address_postcode = ?');
  checkAddressStmt.setString(1, addressData.address_line_1);
  checkAddressStmt.setString(2, addressData.address_postcode);
  var rs = checkAddressStmt.executeQuery();

  if (rs.next()) {
    var existingUuid = rs.getString('address_id');
    console.log("Address already exists with UUID: " + existingUuid);

    // Optionally update existing record if any field is blank
    var updateStmt = conn.prepareStatement('UPDATE sn_addresses SET address_line_2 = ?, address_town = ?, address_county = ?, address_country = ?, address_region_id = ?, import_id = ? WHERE address_id = ?');

    updateStmt.setString(1, addressData.address_line_2 || rs.getString('address_line_2'));
    updateStmt.setString(2, addressData.address_town || rs.getString('address_town'));
    updateStmt.setString(3, addressData.address_county || rs.getString('address_county'));
    updateStmt.setString(4, addressData.address_country || rs.getString('address_country'));
    updateStmt.setString(5, addressData.address_region_id);
    updateStmt.setString(6, importId);
    updateStmt.setString(7, existingUuid);

    updateStmt.execute();
    console.log("Address data updated for UUID: " + existingUuid);

    return existingUuid; // Returning the existing UUID
  } else {
    var insertStmt = conn.prepareStatement('INSERT INTO sn_addresses (address_id, address_line_1, address_line_2, address_town, address_county, address_postcode, address_country, address_region_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

    var newUuid = Utilities.getUuid();
    insertStmt.setString(1, newUuid);
    insertStmt.setString(2, addressData.address_line_1);
    insertStmt.setString(3, addressData.address_line_2);
    insertStmt.setString(4, addressData.address_town);
    insertStmt.setString(5, addressData.address_county);
    insertStmt.setString(6, addressData.address_postcode);
    insertStmt.setString(7, addressData.address_country);
    insertStmt.setString(8, addressData.address_region_id);
    insertStmt.setString(9, importId);

    insertStmt.execute();
    console.log("New address inserted with UUID: " + newUuid);

    return newUuid; // Returning the new UUID
  }

  rs.close();
  checkAddressStmt.close();
}
