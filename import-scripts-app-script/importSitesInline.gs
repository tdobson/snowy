/**
 * Imports site data into the 'sn_sites' table in the database. This function handles the process of importing
 * address and user data, checking for existing site records, and inserting new records if necessary.
 *
 * @param {Object} siteData - An object containing all the necessary details for importing site data.
 *   - {Object} addressData - Details of the site address.
 *     - {string} address_line_1 - The first line of the address (mandatory).
 *     - {string} address_line_2 - The second line of the address (optional).
 *     - {string} address_town - The town of the address (optional).
 *     - {string} address_county - The county of the address (optional).
 *     - {string} address_postcode - The postcode of the address (mandatory).
 *     - {string} address_country - The country of the address (optional).
 *     - {string} address_region_id - Region identifier (updated based on PV number if provided, optional).
 *   - {Object} userData - Details of the site manager.
 *     - {string} sso_id - Single Sign-On identifier (optional).
 *     - {string} name - Full name of the user (mandatory).
 *     - {string} email - Email address of the user (mandatory).
 *     - {string} phone - Phone number of the user (optional).
 *     - {string} employer - Name of the user's employer (optional).
 *     - {string} team - Team identifier, linking to the 'sn_teams' table (optional).
 *     - {string} dispatch_id - Dispatch identifier (optional).
 *     - {string} snowy_role - Role within the Snowy application (optional).
 *     - {string} company_role - Role within their company (optional).
 *     - {string} category - Category of the user (e.g., Human, Company, etc., optional).
 *   - {string} mpanId - The MPAN ID to look up for the DNO details.
 *   - {string} pvNumber - The PV number used for determining the region ID (optional).
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {Sheet} sheet - The Google Sheets Sheet object, used for fetching region details based on the PV number.
 * @returns {string} UUID of the existing or newly created site record.
 *
 * @example
 * // Example usage:
 * var siteData = {
 *   addressData: {
 *     address_line_1: "123 Main St",
 *     address_postcode: "AB12 3CD"
 *   },
 *   userData: {
 *     name: "John Doe",
 *     email: "johndoe@example.com"
 *   },
 *   mpanId: "123456789",
 *   pvNumber: "98765"
 * };
 * var conn = Jdbc.getConnection("jdbc:mysql://<database_url>", "<user>", "<password>");
 * var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
 * var siteId = importSiteData(siteData, conn, sheet);
 */
function importSiteData(siteData, conn, sheet) {
  // Create a unique import ID
  var importId = insertImportEvent(conn, '', 'Site Import', 'Importing site details', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

  // Import Address
  var addressId = importAddressData(siteData.addressData, importId, conn, sheet, siteData.pvNumber);

  // Import User
  var siteManagerId = importUserData(siteData.userData, importId, conn);

  // Check if a record with the same address and site manager ID already exists
  var checkSiteStmt = conn.prepareStatement('SELECT site_id FROM sn_sites WHERE site_address_id = ? AND site_manager_id = ?');
  checkSiteStmt.setString(1, addressId);
  checkSiteStmt.setString(2, siteManagerId);
  var rs = checkSiteStmt.executeQuery();

  if (rs.next()) {
    // Record exists, return the existing site ID
    var existingSiteId = rs.getString('site_id');
    console.log("Site already exists with ID: " + existingSiteId);
    return existingSiteId;
  } else {
    // Insert new site record
    var insertStmt = conn.prepareStatement('INSERT INTO sn_sites (site_id, dno_details_id, site_address_id, site_manager_id, import_id) VALUES (?, ?, ?, ?, ?)');

    // Create a unique site ID
    var siteId = Utilities.getUuid();

    // Lookup DNO ID
    var dnoDetails = lookupDnoDetailsByMpan(siteData.mpanId);
    var dnoId = dnoDetails ? dnoDetails.dno_details_id : null;

    insertStmt.setString(1, siteId);
    insertStmt.setString(2, dnoId);
    insertStmt.setString(3, addressId);
    insertStmt.setString(4, siteManagerId);
    insertStmt.setString(5, importId);

    insertStmt.execute();
    console.log("New site inserted with ID: " + siteId);

    return siteId; // Returning the new site ID
  }
}
