//The initial admin user uuid is 4df57691-4d43-4cfb-9338-00e4cfafa63d
// this can be used to regenerate the above uuid

function insertUserAndGetUuid(conn, instanceId) {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var uuid = Utilities.getUuid();

    var stmt = conn.prepareStatement('INSERT INTO sn_users (user_id, name, email, employer, company_role, snowy_role,instance_id) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.setString(1, uuid);
    stmt.setString(2, 'Tim Dobson');
    stmt.setString(3, 'snowy@tdobson.net');
    stmt.setString(4, 'Migrating Dragons');
    stmt.setString(5, 'Director');
    stmt.setString(6, 'Administrator');
    stmt.setString(7, instanceId)

    stmt.execute();
    conn.close();
    return uuid;
}

function insertInstanceAndGetUuid(client_id, client_name,client_description) {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var uuid = Utilities.getUuid();
   var userId =  insertUserAndGetUuid(uuid)
    var stmt = conn.prepareStatement('INSERT INTO sn_instances (instance_id, instance_name_key, instance_name, instance_description, instance_key_contact) VALUES (?, ?, ?, ?, ?)');
    stmt.setString(1, uuid);
    stmt.setString(2, client_id);
    stmt.setString(3, client_name);
    stmt.setString(4, client_description);
    stmt.setString(5, userId); // Set the initial admin user UUID as the key contact

    stmt.execute();
    conn.close();
    return {instanceId: uuid, adminUserId: userId };
}
