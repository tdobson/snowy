//The initial admin user uuid is 4df57691-4d43-4cfb-9338-00e4cfafa63d
// this can be used to regenerate the above uuid

function insertUserAndGetUuid() {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var uuid = Utilities.getUuid();

    var stmt = conn.prepareStatement('INSERT INTO sn_users (user_id, name, email, employer, company_role, snowy_role) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.setString(1, uuid);
    stmt.setString(2, 'Tim Dobson');
    stmt.setString(3, 'snowy@tdobson.net');
    stmt.setString(4, 'Migrating Dragons');
    stmt.setString(5, 'Director');
    stmt.setString(6, 'Administrator');

    stmt.execute();
    conn.close();
    return uuid;
}
