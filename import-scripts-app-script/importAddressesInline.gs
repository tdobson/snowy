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
 * - Call this function with an object containing address details, a unique import ID, an instance ID, a database connection,
 *   a Sheet object, and an optional PV number.
 * - The function checks the address against the database using the address line 1, postcode, and instance ID.
 * - If a PV number is provided, the function attempts to fetch the corresponding region number and region ID.
 * - If the address exists, the function updates it; otherwise, it inserts a new address.
 *
 * @param {String} instanceId - The unique identifier for the customer instance.
 * @param {Object} addressData - An object containing the address details. Expected keys:
 *   - address_line_1: String - Mandatory. The first line of the address.
 *   - address_line_2: String - Optional. The second line of the address.
 *   - address_town: String - Optional. The town of the address.
 *   - address_county: String - Optional. The county of the address.
 *   - address_postcode: String - Mandatory. The postcode of the address.
 *   - address_country: String - Optional. The country of the address.
 *   - address_region_id: String - Optional. Region identifier (updated based on PV number if provided).
 *   - address_region_number: String - Optional. Looks up region_id based on this if it exists.
 *   - customFields - Custom fields data for the address. The object should have the following structure:
 *     - {string} entityType - The type of entity the custom fields belong to. For address custom fields, this should be 'address'.
 *     - {string} entityId - The UUID of the specific address instance the custom fields are associated with.
 *     - {string} instanceId - Optional: The UUID of the instance or customer associated with the custom fields.
 *     - {Object} fields - An object containing key-value pairs of custom field names and their corresponding details.
 *       - {string} fieldName - The name or key of the custom field.
 *         - {*} value - The actual value of the custom field. The type depends on the field's data type.
 *         - {string} uiName - Optional: The user-editable name of the custom field.
 *         - {string} description - Optional: The user-editable description of the custom field.
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
function importAddress(conn, instanceId, importId, addressData, sheet, pvNumber) {
    if (!addressData.address_line_1 || !addressData.address_postcode || !instanceId) {
        console.log("Address line 1 and postcode are required.");
        return;
    }

    var regionId;

    // Check if address_region_number is provided and use it to get regionId
    if (addressData.address_region_number) {
        try {
            regionId = getRegionIdFromRegionNumber(conn, instanceId, addressData.address_region_number);
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
            regionId = getRegionIdFromRegionNumber(conn,instanceId, regionNumber);
            if (regionId) {
                addressData.address_region_id = regionId;
            }
        } catch (error) {
            console.log("Couldn't get region ID from PV number: " + error.message);
        }
    }

    var checkAddressStmt = conn.prepareStatement('SELECT * FROM sn_addresses WHERE instance_id = ? AND address_line_1 = ? AND address_postcode = ?');
    checkAddressStmt.setString(1, instanceId);
    checkAddressStmt.setString(2, addressData.address_line_1);
    checkAddressStmt.setString(3, addressData.address_postcode);
    var rs = checkAddressStmt.executeQuery();

    if (rs.next()) {
        var existingUuid = rs.getString('address_id');
        console.log("Address already exists with UUID: " + existingUuid);

        // Optionally update existing record if any field is blank
        var updateStmt = conn.prepareStatement('UPDATE sn_addresses SET address_line_2 = ?, address_town = ?, address_county = ?, address_country = ?, address_region_id = ?, import_id = ? WHERE instance_id = ? AND address_id = ?');

        updateStmt.setString(1, addressData.address_line_2 || rs.getString('address_line_2'));
        updateStmt.setString(2, addressData.address_town || rs.getString('address_town'));
        updateStmt.setString(3, addressData.address_county || rs.getString('address_county'));
        updateStmt.setString(4, addressData.address_country || rs.getString('address_country'));
        updateStmt.setString(5, addressData.address_region_id);
        updateStmt.setString(6, importId);
        updateStmt.setString(7, instanceId);
        updateStmt.setString(8, existingUuid);

        updateStmt.execute();
        console.log("Address data updated for UUID: " + existingUuid);

        // Import custom fields for the existing address
        if (addressData.customFields) {
            addressData.customFields.entityType = 'address';
            addressData.customFields.entityId = existingUuid;
            var customFieldsImported = importCustomFields(conn,instanceId, importId, addressData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for address: ' + existingUuid);
            }
        }

        return existingUuid; // Returning the existing UUID
    } else {
        var insertStmt = conn.prepareStatement('INSERT INTO sn_addresses (address_id, instance_id, address_line_1, address_line_2, address_town, address_county, address_postcode, address_country, address_region_id, import_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

        var newUuid = Utilities.getUuid();
        insertStmt.setString(1, newUuid);
        insertStmt.setString(2, instanceId);
        insertStmt.setString(3, addressData.address_line_1);
        insertStmt.setString(4, addressData.address_line_2);
        insertStmt.setString(5, addressData.address_town);
        insertStmt.setString(6, addressData.address_county);
        insertStmt.setString(7, addressData.address_postcode);
        insertStmt.setString(8, addressData.address_country);
        insertStmt.setString(9, addressData.address_region_id);
        insertStmt.setString(10, importId);

        insertStmt.execute();
        console.log("New address inserted with UUID: " + newUuid);

        // Import custom fields for the new address
        if (addressData.customFields) {
            addressData.customFields.entityType = 'address';
            addressData.customFields.entityId = newUuid;
            var customFieldsImported = importCustomFields(conn,instanceId, importId, addressData.customFields);
            if (!customFieldsImported) {
                console.error('Failed to import custom fields for address: ' + newUuid);
            }
        }

        return newUuid; // Returning the new UUID
    }

    rs.close();
    checkAddressStmt.close();
}
