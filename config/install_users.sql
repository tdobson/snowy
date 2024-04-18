-- Grant privileges to the 'devicemagic' user on the 'sn_dm_electrical_submissions' table in the 'snowy' database. todo
CREATE USER 'devicemagic'@'%' IDENTIFIED BY 'xuoqu3eengea4risei6ahsooJaepoon4Ooquuu7';
GRANT SELECT, INSERT, UPDATE ON snowy.sn_dm_electrical_submissions TO 'devicemagic'@'%';

-- Grant privileges to the 'devicemagic' user on everything in the 'snowy' database.
CREATE USER 'snowy_user'@'%' IDENTIFIED BY 'Fugheu5auv9zohf0xee3ziefei6gan';
GRANT SELECT, INSERT, UPDATE ON snowy.* TO 'snowy'@'%';

-- Reload all the privileges.
FLUSH PRIVILEGES;
