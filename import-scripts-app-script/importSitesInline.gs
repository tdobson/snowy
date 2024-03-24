/**
* Imports site data into the 'sn_sites' table in the database. This function handles the process of importing
* address, site manager, site surveyor, and site agent data, checking for existing site records, and inserting
* new records if necessary. It also includes the site name in the site record and updates the existing record
* if a matching site is found.
*
* Prerequisites:
* - The database should have the 'sn_sites', 'sn_addresses', and 'sn_users' tables set up.
* - The 'lookupDnoDetailsByMpan' function should be defined and functional.
*
* Usage:
* - Call this function with an active JDBC connection, an instance ID, a unique import ID, site data, and a Google Sheets Sheet object.
* - The site data object should contain all the necessary details for importing site data, including address, user data, MPAN ID, and PV number.
*
* @param {JdbcConnection} conn - An active JDBC connection to the database.
* @param {string} instanceId - The unique identifier for the customer instance.
* @param {string} importId - A unique identifier for the import session.
* @param {Object} siteData - An object containing all the necessary details for importing site data, including:
*   - {Object} addressData - Details of the site address:
*     - {string} address_line_1 - The first line of the address (mandatory).
*     - {string} address_line_2 - The second line of the address (optional).
*     - {string} address_town - The town of the address (optional).
*     - {string} address_county - The county of the address (optional).
*     - {string} address_postcode - The postcode of the address (mandatory).
*     - {string} address_country - The country of the address (optional).
*     - {string} address_region_id - Region identifier (updated based on PV number if provided, optional).
*   - {Object} userData - Details of the site manager:
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
*   - {Object} surveyorData - Details of the site surveyor:
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
*   - {Object} agentData - Details of the site agent:
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
*   - {string} siteName - The name of the site (mandatory).
*   - {Object} customFields - Custom fields data for the site. The object should have the following structure:
*     - {string} entityType - The type of entity the custom fields belong to. For site custom fields, this should be 'site'.
*     - {string} entityId - The UUID of the specific site instance the custom fields are associated with.
*     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
*     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
*       - {string} fieldName - The name or key of the custom field.
*         - {*} value - The actual value of the custom field. The type depends on the field's data type.
*         - {string} uiName - Optional: The user-editable name of the custom field.
*         - {string} description - Optional: The user-editable description of the custom field.
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
*   surveyorData: {
*     name: "Jane Smith",
*     email: "janesmith@example.com"
*   },
*   agentData: {
*     name: "Bob Johnson",
*     email: "bobjohnson@example.com"
*   },
*   siteName: "Main Site",
*   mpanId: "123456789",
*   pvNumber: "98765",
*   customFields: {  custom fields data  }
* };
* var conn = Jdbc.getConnection("jdbc:mysql://<database_url>", "<user>", "<password>");
* var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
* var siteId = importSiteData(conn, instanceId, importId, siteData, sheet);
*/
function importSiteData(conn, instanceId, importId, siteData, sheet) {
  // Import Address
  var addressId = importAddress(conn, instanceId, importId, siteData.addressData, sheet, siteData.pvNumber);

  // Import User
  var siteManagerId = importUserData(conn, instanceId, importId, siteData.userData);
  var siteSurveyorId = importUserData(conn, instanceId, importId, siteData.surveyorData);
  var siteAgentId = importUserData(conn, instanceId, importId, siteData.agentData);

  // Check if a record with the same address, site manager ID, and site name already exists for the given instance_id
  var checkSiteStmt = conn.prepareStatement('SELECT * FROM sn_sites WHERE instance_id = ? AND site_address_id = ? AND site_manager_id = ? AND site_name = ?');
  checkSiteStmt.setString(1, instanceId);
  checkSiteStmt.setString(2, addressId);
  checkSiteStmt.setString(3, siteManagerId);
  checkSiteStmt.setString(4, siteData.siteName);
  var rs = checkSiteStmt.executeQuery();

  if (rs.next()) {
    // Record exists, update the existing site with the new data
    var existingSiteId = rs.getString('site_id');
    console.log("Site already exists with ID: " + existingSiteId);

    // Update the existing site record with new data
    var updateStmt = conn.prepareStatement('UPDATE sn_sites SET dno_details_id = ?, site_name = ?, site_surveyor_id = ?, site_agent_id = ?, import_id = ? WHERE site_id = ? AND instance_id = ?');

    // Lookup DNO ID
    var dnoDetails = lookupDnoDetailsByMpan(conn, importId, siteData.mpanId);
    var dnoId = dnoDetails ? dnoDetails.dno_details_id : rs.getString('dno_details_id');
    console.log("DNO ID: ", dnoId);

    updateStmt.setString(1, dnoId);
    updateStmt.setString(2, siteData.siteName || rs.getString('site_name'));
    updateStmt.setString(3, siteSurveyorId || rs.getString('site_surveyor_id'));
    updateStmt.setString(4, siteAgentId || rs.getString('site_agent_id'));
    updateStmt.setString(5, importId);
    updateStmt.setString(6, existingSiteId);
    updateStmt.setString(7, instanceId);

    updateStmt.execute();
    console.log("Site updated with ID: " + existingSiteId);

    // Import custom fields for the existing site
    if (siteData.customFields) {
      siteData.customFields.entityType = 'site';
      siteData.customFields.entityId = existingSiteId;
      var customFieldsImported = importCustomFields(conn, instanceId, importId, siteData.customFields);
      if (!customFieldsImported) {
        console.error('Failed to import custom fields for site: ' + existingSiteId);
      }
    }

    return existingSiteId;
  } else {
    // Insert new site record
    var insertStmt = conn.prepareStatement('INSERT INTO sn_sites (site_id, instance_id, dno_details_id, site_address_id, site_manager_id, site_surveyor_id, site_agent_id, site_name, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

    // Create a unique site ID
    var siteId = Utilities.getUuid();

    // Lookup DNO ID
    var dnoDetails = lookupDnoDetailsByMpan(conn, importId, siteData.mpanId);
    var dnoId = dnoDetails ? dnoDetails.dno_details_id : null;
    console.log("DNO ID: ", dnoId);

    insertStmt.setString(1, siteId);
    insertStmt.setString(2, instanceId);
    insertStmt.setString(3, dnoId);
    insertStmt.setString(4, addressId);
    insertStmt.setString(5, siteManagerId);
    insertStmt.setString(6, siteSurveyorId);
    insertStmt.setString(7, siteAgentId);
    insertStmt.setString(8, siteData.siteName);
    insertStmt.setString(9, importId);

    insertStmt.execute();
    console.log("New site inserted with ID: " + siteId + " and name: " + siteData.siteName);

    // Import custom fields for the new site
    if (siteData.customFields) {
      siteData.customFields.entityType = 'site';
      siteData.customFields.entityId = siteId;
      var customFieldsImported = importCustomFields(conn, instanceId, importId, siteData.customFields);
      if (!customFieldsImported) {
        console.error('Failed to import custom fields for site: ' + siteId);
      }
    }

    return siteId;
  }
}
