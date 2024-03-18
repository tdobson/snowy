

-- First, insert an entry into sn_import_events
SET @import_event_id = UUID(); -- Generate a unique ID for the import event
INSERT INTO sn_import_events (import_id, import_date, user_id, import_ref, import_source, import_notes)
VALUES (@import_event_id, CURDATE(), '6b134067-3813-4bea-84e6-8eeaf755c5ef', NULL, 'User Import', 'Testing user import');

-- Now, insert the user details into sn_users
-- Inserting user: Tim Dobson
INSERT INTO sn_users (user_id, name, email, employer, snowy_role, import_id)
VALUES ('6b134067-3813-4bea-84e6-8eeaf755c5ef', 'Tim Dobson', 'tim@migratingdragons.com', 'Xebit', 'Administrator', @import_event_id);

-- Inserting user: Graham Walden
INSERT INTO sn_users (user_id, name, email, employer, snowy_role, import_id)
VALUES ('e47d1391-f6c4-4188-8aa3-fcc38c3ed8a5', 'Graham Walden', 'wal@xebit.net', 'Xebit', 'Administrator', @import_event_id);



-- First, insert an entry into sn_import_events
SET @import_event_id = UUID(); -- Generate a unique ID for the import event
INSERT INTO sn_import_events (import_id, import_date, user_id, import_ref, import_source, import_notes)
VALUES (@import_event_id, CURDATE(), '1', NULL, 'DNO Tracker', 'Testing import');

-- Next, insert entries into sn_status using the generated import_id
INSERT INTO sn_status (status_id, status_state, status_name, status_code, status_description, import_id) VALUES
(UUID(), 'Missing Info', 'DNO Status', '1', '', @import_event_id),
(UUID(), 'Awaiting Application', 'DNO Status', '2', '', @import_event_id),
(UUID(), 'Application Submitted', 'DNO Status', '3', '', @import_event_id),
(UUID(), 'Approval Pending Payment', 'DNO Status', '4', '', @import_event_id),
(UUID(), 'Partial Approval', 'DNO Status', '5', '', @import_event_id),
(UUID(), 'Full Approval', 'DNO Status', '6', '', @import_event_id);


