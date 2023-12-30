/* var testAddressData = {
    address_line_1: "123 Main St",          // First line of the address
    address_line_2: "Apt 4",                // Second line of the address
    address_town: "Anytown",                // Town of the address
    address_county: "Anycountry",           // County of the address
    address_postcode: "12345",              // Postcode of the address
    address_country: "Countryland",         // Country of the address
    address_region_id: "region_uuid_here"   // Region identifier, linking to the 'sn_regions' table
};
*/

/**
 * Imports address data into the database.
 *
 * @param {Object} addressData - The address data object to be imported.
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {String} importId - The import ID from the original import.
 */
function importAddressData(addressData, importId, conn) {
  // Example check: address_line_1 and postcode
  if (!addressData.address_line_1 || !addressData.address_postcode) {
    console.log("Address line 1 and postcode are required.");
    return;
  }

  // Check if the address is already present in the database
  var checkAddressStmt = conn.prepareStatement('SELECT * FROM sn_addresses WHERE address_line_1 = ? AND address_postcode = ?');
  checkAddressStmt.setString(1, addressData.address_line_1);
  checkAddressStmt.setString(2, addressData.address_postcode);
  var rs = checkAddressStmt.executeQuery();



  if (rs.next()) {
    // Address exists, update blank fields
    var updateStmt = conn.prepareStatement('UPDATE sn_addresses SET address_line_2 = ?, address_town = ?, address_county = ?, address_country = ?, address_region_id = ?, import_id = ? WHERE address_line_1 = ? AND address_postcode = ?');

    updateStmt.setString(1, addressData.address_line_2 || rs.getString('address_line_2'));
    updateStmt.setString(2, addressData.address_town || rs.getString('address_town'));
    updateStmt.setString(3, addressData.address_county || rs.getString('address_county'));
    updateStmt.setString(4, addressData.address_country || rs.getString('address_country'));
    updateStmt.setString(5, addressData.address_region_id || rs.getString('address_region_id'));
    updateStmt.setString(6, importId);
    updateStmt.setString(7, addressData.address_line_1);
    updateStmt.setString(8, addressData.address_postcode);

    updateStmt.execute();
    console.log("Address data updated for address line 1: " + addressData.address_line_1 + ", postcode: " + addressData.address_postcode);
  } else {
    // Address isn't present, insert new data
    var insertStmt = conn.prepareStatement('INSERT INTO sn_addresses (address_id, address_line_1, address_line_2, address_town, address_county, address_postcode, address_country, address_region_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

    var uuid = Utilities.getUuid(); // Generate a UUID for the new address
    insertStmt.setString(1, uuid);
    insertStmt.setString(2, addressData.address_line_1);
    insertStmt.setString(3, addressData.address_line_2);
    insertStmt.setString(4, addressData.address_town);
    insertStmt.setString(5, addressData.address_county);
    insertStmt.setString(6, addressData.address_postcode);
    insertStmt.setString(7, addressData.address_country);
    insertStmt.setString(8, addressData.address_region_id);
    insertStmt.setString(9, importId);

    insertStmt.execute();
    console.log("New address inserted with address line 1: " + addressData.address_line_1 + ", postcode: " + addressData.address_postcode);
  }

  // Close resources
  rs.close();
  checkAddressStmt.close();
}
