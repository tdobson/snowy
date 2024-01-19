/**
 * Imports an array of client data objects into a MySQL database.
 * Each object in the array is processed to insert or update data into 'sn_clients', 'sn_users', and 'sn_addresses' tables.
 * This function uses prepared statements for database operations and logs an import event for traceability.
 *
 * Prerequisites:
 * - MySQL database with 'sn_import_events', 'sn_clients', 'sn_users', and 'sn_addresses' tables set up.
 * - Correct database connection details configured in the script.
 *
 * Usage:
 * - Call this function with an array of client data objects, a database connection, and a unique import ID.
 *
 * @param {Object[]} clientDataArray - An array of objects containing client and contact details to be imported.
 * @param {JdbcConnection} conn - An active JDBC connection to the database.
 * @param {String} importId - A unique identifier for the import session.
 *
 * @returns {void}
 */
 function importClientData(clientDataArray, conn, importId) {
     var checkClientStmt = conn.prepareStatement('SELECT * FROM sn_clients WHERE client_name = ?');
     var insertClientStmt = conn.prepareStatement('INSERT INTO sn_clients (client_id, client_name, address_id, contact_id, import_id) VALUES (?, ?, ?, ?, ?)');
     var updateClientStmt = conn.prepareStatement('UPDATE sn_clients SET address_id = ?, contact_id = ? WHERE client_name = ?');

     clientDataArray.forEach(function(clientData) {
         var userId = importUserData(clientData, importId, conn);
         var addressId = importAddressData(clientData.address, importId, conn);

         // Check and insert/update client data
         checkClientStmt.setString(1, clientData.name);
         var clientResult = checkClientStmt.executeQuery();
         if (clientResult.next()) {
             updateClientStmt.setString(1, addressId);
             updateClientStmt.setString(2, userId);
             updateClientStmt.setString(3, clientData.name);
             updateClientStmt.execute();
         } else {
             var clientUuid = Utilities.getUuid();
             insertClientStmt.setString(1, clientUuid);
             insertClientStmt.setString(2, clientData.name);
             insertClientStmt.setString(3, addressId);
             insertClientStmt.setString(4, userId);
             insertClientStmt.setString(5, importId);
             insertClientStmt.execute();
         }
     });

     conn.close();
     Logger.log('Client and contact details import/update complete.');
 }

