CREATE USER 'devicemagic'@'%' IDENTIFIED BY 'xuoqu3eengea4risei6ahsooJaepoon4Ooquuu7'; -- //todo

-- Grant privileges to the 'devicemagic' user on the 'sn_dm_electrical_submissions' table in the 'snowy' database.
GRANT SELECT, INSERT, UPDATE ON snowy.sn_dm_electrical_submissions TO 'devicemagic'@'%';

-- Reload all the privileges.
FLUSH PRIVILEGES;