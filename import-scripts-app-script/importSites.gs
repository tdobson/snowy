-- This table details the sites where projects are located, including address and contact information for site managers and DNO responsible.
CREATE TABLE IF NOT EXISTS sn_sites (
    site_id CHAR(36) NOT NULL,        -- Unique identifier for the site.
    project_id CHAR(36) NOT NULL      -- Project ID, linking the site to a specific project in sn_projects.
    dno_details_id CHAR(36),          -- DNO details ID, linking to the sn_dno_details table.
    site_address_line_1 VARCHAR(255), -- First line of the site address.
    site_address_line_2 VARCHAR(255), -- Second line of the site address.
    site_town VARCHAR(255),           -- Town where the site is located.
    site_county VARCHAR(255),         -- County where the site is located.
    site_postcode VARCHAR(255),       -- Postcode for the site.
    dno_responsible_name VARCHAR(255),-- Name of the DNO responsible for the site.
    dno_responsible_email VARCHAR(255),-- Email of the DNO responsible.
    site_manager_name VARCHAR(255),   -- Name of the site manager.
    site_manager_email VARCHAR(255),  -- Email of the site manager.
    site_manager_phone VARCHAR(255),  -- Phone number of the site manager.
    import_id CHAR(36),
    PRIMARY KEY (site_id),
    FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    FOREIGN KEY (dno_details_id) REFERENCES sn_dno_details(dno_details_id)
);