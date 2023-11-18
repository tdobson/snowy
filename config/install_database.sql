-- Create the 'snowy' database if it does not exist
CREATE DATABASE IF NOT EXISTS snowy;
USE snowy;

-- Now, proceed with creating tables within the 'snowy' database

-- This table stores all projects. Each project is linked to a client and a site, and it contains various project-specific details.
CREATE TABLE IF NOT EXISTS sn_projects (
    project_id CHAR(36) NOT NULL,    -- Unique identifier for the project.
    client_id CHAR(36),              -- Client ID, linking this project to a client in the sn_clients table.
    pv_number VARCHAR(255),          -- PV number pattern 'PV[0-9]{6}'.
    region_id CHAR(36),              -- Region ID, linking to the sn_region table.
    project_name VARCHAR(255),       -- Name of the project.
    site_id CHAR(36),                -- Site ID, linking to the sn_sites table.
    dno_mpan_ref INT,                -- Reference to DNO MPAN (Meter Point Administration Number).
    ref_number VARCHAR(255),         -- Legacy reference number for the project.
    job_code VARCHAR(255),           -- Client's project reference code.
    site_live BOOLEAN,               -- Indicates if the site is live (operational).
    deadline_to_connect DATE,        -- Deadline for the project to connect.
    auth_letter_sent BOOLEAN,        -- Indicates if the letter of authority has been sent.
    mpan_request_sent BOOLEAN,       -- Indicates if the MPAN request has been sent.
    schematic_created BOOLEAN,       -- Indicates if the schematic for the project has been created.
    application_type VARCHAR(255),   -- Type of application (e.g., g98, g99, g100, or mixed).
    formal_dno_submitted BOOLEAN,    -- Indicates if the formal DNO submission has been made.
    submission_date DATE,            -- Date of submission of paperwork.
    dno_due_date DATE,               -- Due date for DNO to reply.
    dno_status VARCHAR(255),         -- Status related to the DNO approval.
    approved_kwp FLOAT,              -- Approved kilowatt-peak by the DNO.
    quote_received BOOLEAN,          -- Indicates if the quote has been received.
    customer_invoiced_date DATE,     -- Date when the customer was invoiced.
    dno_payment_made DATE,           -- Date when payment to DNO was made.
    acceptance_form_returned BOOLEAN,-- Indicates if the acceptance form has been returned.
    date_approved DATE,              -- Date when the project was approved.
    comments TEXT,                   -- Additional comments about the project.
    import_id CHAR(36),
    PRIMARY KEY (project_id),
    FOREIGN KEY (client_id) REFERENCES sn_clients(client_id),
    FOREIGN KEY (region_id) REFERENCES sn_region(region_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    FOREIGN KEY (site_id) REFERENCES sn_sites(site_id)
);


-- Table: sn_plots
-- This table stores information about individual plots in projects.
CREATE TABLE IF NOT EXISTS sn_plots (
    plot_id CHAR(36) NOT NULL,       -- Unique identifier for each plot.
    project_id CHAR(36),             -- Foreign key to 'sn_projects', identifying the project the plot belongs to.
    plot_number VARCHAR(255),        -- Alphanumeric identifier for the plot.
    tracker_ref CHAR(36),            -- Reference to a tracking system, if applicable.
    status CHAR(36),                 -- Foreign key to 'sn_status', indicating the current status of the plot.
    siteId CHAR(36),                 -- Foreign key to 'sn_sites', identifying the site where the plot is located.
    housetype VARCHAR(255),          -- Description of the type of house on the plot.
    g99 BOOLEAN,                     -- Boolean indicating whether G99 standards apply.
    mpan VARCHAR(255),               -- MPAN (Meter Point Administration Number) for the plot.
    postal_name_number VARCHAR(255), -- Name or number for postal purposes.
    postal_street VARCHAR(255),      -- Street address for postal purposes.
    postal_postcode VARCHAR(255),    -- Postal code for the plot.
    plot_approved BOOLEAN,           -- Boolean indicating whether the plot has been approved.
    dno_zone VARCHAR(255),           -- Zone identifier for the DNO (Distribution Network Operator).
    plot_specified VARCHAR(255),     -- Specifies whether the plot has been specified for certain criteria.
    import_id CHAR(36),          -- Identifier for data import, if applicable.
    commissioning_form_submitted BOOLEAN, -- Boolean indicating whether the commissioning form has been submitted.
    PRIMARY KEY (plot_id),
    FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    FOREIGN KEY (tracker_ref) REFERENCES sn_status(status_id),
    FOREIGN KEY (siteId) REFERENCES sn_sites(site_id)
);


-- This table holds the specifications for individual plots.
-- It includes details such as the date of specification, the person who specified it, and various technical and financial details about the plot.
CREATE TABLE IF NOT EXISTS sn_plot_specified (
    plot_meta_id CHAR(36) NOT NULL,  -- Unique identifier for the plot specification.
    date_specified DATE,             -- The date when this specification was made.
    specified_by CHAR(36),           -- User ID of the person who specified this plot, linked to the sn_users table.
    status CHAR(36),                 -- The status of the plot, linked to a status table (like 'pending', 'approved').
    phase VARCHAR(255),              -- Phase of the project (e.g., '1' or '3').
    p1 FLOAT,                        -- Details specific to phase 1 (e.g., power-related values).
    p2 FLOAT,                        -- Details specific to phase 2, if applicable.
    p3 FLOAT,                        -- Details specific to phase 3, if applicable.
    annual_yield FLOAT,              -- Expected annual yield from the plot (in units like kWh).
    kwp_with_limitation FLOAT,       -- Kilowatt-peak with any limitations applied.
    limiter_required BOOLEAN,        -- Whether a limiter is required for the plot.
    limiter_value_if_not_zero FLOAT, -- The value of the limiter if it's not zero.
    labour_cost FLOAT,               -- Labour cost for working on the plot.
    meter INT,                       -- Meter product ID, linked to a products table.
    meter_cost FLOAT,                -- Cost of the meter.
    battery INT,                     -- Battery product ID, linked to a products table.
    battery_cost FLOAT,              -- Cost of the battery.
    overall_cost FLOAT,              -- Total cost associated with this plot.
    landlord_supply BOOLEAN,         -- Indicates if the landlord is responsible for the supply.
    import_id CHAR(36),          -- Identifier for the import record, if this data was imported.
    PRIMARY KEY (plot_meta_id),
    FOREIGN KEY (specified_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    FOREIGN KEY (status) REFERENCES sn_status(status_id),
    FOREIGN KEY (meter) REFERENCES sn_products(product_id),
    FOREIGN KEY (battery) REFERENCES sn_products(product_id)
);


-- This table records details about the installation of each plot.
CREATE TABLE IF NOT EXISTS sn_plot_installed (
    plot_meta_id CHAR(36) NOT NULL,  -- Unique identifier for each installed plot. It's like a 'version' of a plot after it's installed.
    date_installed DATE,             -- The date when the plot was actually installed.
    date_checked DATE,               -- The date when the installation was checked or verified for quality or compliance.
    installed_by CHAR(36),           -- User ID of the person who installed the plot. This links to the 'sn_users' table.
    checked_by CHAR(36),             -- User ID of the person who checked the plot. Also links to the 'sn_users' table.
    status CHAR(36),                 -- The current status of the plot after installation, linking to a status table (e.g., 'complete', 'pending review').
    phase VARCHAR(255),              -- The phase of the project during which this installation occurred (e.g., 'initial installation', 'final setup').
    p1 FLOAT,                        -- Details specific to phase 1 of the installation, possibly related to power or capacity.
    p2 FLOAT,                        -- Details specific to phase 2, if applicable.
    p3 FLOAT,                        -- Details specific to phase 3, if applicable.
    annual_yield FLOAT,              -- The expected annual yield from the plot post-installation, measured in units like kWh.
    kwp_with_limitation FLOAT,       -- The kilowatt-peak of the plot with any limitations factored in.
    limiter_required BOOLEAN,        -- Indicates whether a power limiter was required for the plot.
    limiter_value_if_not_zero FLOAT, -- Specifies the value of the limiter, assuming it's not zero.
    labour_cost FLOAT,               -- The cost of labour involved in installing the plot.
    meter INT,                       -- A reference to the type of meter used, linked to a product ID in 'sn_products'.
    meter_cost FLOAT,                -- The cost of the meter used in the installation.
    battery INT,                     -- A reference to the type of battery used, linked to a product ID in 'sn_products'.
    battery_cost FLOAT,              -- The cost of the battery used in the installation.
    overall_cost FLOAT,              -- The total cost of the installation, including all components and labour.
    import_id CHAR(36),          -- If this data was imported, this is the ID of the import event for traceability.
    PRIMARY KEY (plot_meta_id),
    FOREIGN KEY (installed_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (checked_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (status) REFERENCES sn_status(status_id),
    FOREIGN KEY (meter) REFERENCES sn_products(product_id),
    FOREIGN KEY (battery) REFERENCES sn_products(product_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);


-- This table details the elevations of each plot, which is crucial in solar installations for understanding the positioning and potential energy yield.
CREATE TABLE IF NOT EXISTS sn_elevations (
    elevation_id CHAR(36) NOT NULL,  -- Unique identifier for each elevation record.
    plot_ref_id CHAR(36),            -- Reference to the plot, either as specified or as installed.
    type_test_ref VARCHAR(255),      -- A reference to a type test or other technical specification.
    pitch FLOAT,                     -- The pitch of the installation surface, crucial for solar panel installations.
    orientation VARCHAR(255),        -- The orientation of the solar panels (e.g., north, south).
    kk_figure FLOAT,                 -- A figure used in calculations, possibly related to energy yield or efficiency.
    kwp FLOAT,                       -- Kilowatt-peak of the installation at this elevation.
    strings INT,                     -- Number of strings (groups of panels) in the solar setup.
    module_qty INT,                  -- Quantity of modules (individual solar panels) in the setup.
    inverter VARCHAR(255),           -- Identifier for the inverter used, possibly linked to a product ID.
    inverter_cost FLOAT,             -- The cost of the inverter.
    panel VARCHAR(255),              -- Identifier for the type of solar panel used.
    panel_cost FLOAT,                -- The cost of the solar panels.
    panels_total_cost FLOAT,         -- Total cost of all the panels used in the elevation.
    roof_kit VARCHAR(255),           -- Identifier for the roof mounting kit used.
    roof_kit_cost FLOAT,             -- Cost of the roof mounting kit.
    annual_yield FLOAT,              -- The expected annual energy yield from this elevation setup.
    import_id CHAR(36),
    PRIMARY KEY (elevation_id),
    FOREIGN KEY (inverter) REFERENCES sn_products(product_id),
    FOREIGN KEY (panel) REFERENCES sn_products(product_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    FOREIGN KEY (roof_kit) REFERENCES sn_products(product_id),
    FOREIGN KEY (plot_ref_id) REFERENCES sn_plot_specified(plot_meta_id)
);


-- Table: sn_form_submissions
-- This table tracks various form submissions related to plots, sites, and products.
-- It links to the 'sn_plots', 'sn_sites', and 'sn_products' tables.
CREATE TABLE IF NOT EXISTS sn_form_submissions (
    submission_id CHAR(36) NOT NULL,  -- Unique identifier for each submission.
    plot_id CHAR(36),                -- Foreign key to 'sn_plots', identifying the plot related to the submission.
    job_id CHAR(36),                -- Foreign key to 'sn_sites', identifying the site related to the submission.
    import_id CHAR(36),
    PRIMARY KEY (submission_id),
    FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    FOREIGN KEY (job_id) REFERENCES sn_jobs(job_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);


-- Table: sn_jobs
-- This table tracks jobs assigned to plots and projects, and their statuses.
CREATE TABLE IF NOT EXISTS sn_jobs (
    job_id CHAR(36) NOT NULL,        -- Unique identifier for each job.
    plot_id CHAR(36),                -- Foreign key to 'sn_plots', identifying the plot associated with the job.
    plot_number VARCHAR(255),        -- Plot number associated with the job.
    project_number VARCHAR(255),     -- Project number associated with the job.
    project_id CHAR(36),             -- Foreign key to 'sn_projects', identifying the project associated with the job.
    dispatch_id VARCHAR(255),        -- Dispatch identifier for the job.
    submission_id CHAR(36),          -- Foreign key to 'sn_form_submissions', linking the job to a submission.
    dispatched_at DATE,              -- Date when the job was dispatched.
    dispatched_by CHAR(36),          -- Foreign key to 'sn_users', identifying the user who dispatched the job.
    returned_at DATE,                -- Date when the job was returned.
    returned_by CHAR(36),            -- Foreign key to 'sn_users', identifying the user who returned the job.
    dispatch_team CHAR(36),          -- Foreign key to 'sn_teams', identifying the team responsible for the dispatch.
    status CHAR(36),                 -- Foreign key to 'sn_job_statuses', indicating the status of the job.
    user_id CHAR(36),                -- Foreign key to 'sn_users', identifying the user responsible for the job.
    slot_id CHAR(36),                -- Foreign key to 'sn_slots', linking the job to a specific time slot.
    import_id CHAR(36),
    PRIMARY KEY (job_id),
    FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    FOREIGN KEY (dispatched_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (returned_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (status) REFERENCES sn_job_statuses(job_status_id),
    FOREIGN KEY (user_id) REFERENCES sn_users(user_id),
    FOREIGN KEY (slot_id) REFERENCES sn_slots(slot_id),
    FOREIGN KEY (dispatch_team) REFERENCES sn_teams(team_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);

-- Table: sn_users
-- This table stores information about users, including their roles and team affiliations.
CREATE TABLE IF NOT EXISTS sn_users (
    user_id CHAR(36) NOT NULL,       -- Unique identifier for each user.
    sso_id VARCHAR(255),             -- Single Sign-On identifier, if applicable.
    name VARCHAR(255),               -- Name of the user.
    email VARCHAR(255),              -- Email address of the user.
    employer VARCHAR(255),           -- Employer name for the user.
    team CHAR(36),                   -- Foreign key to 'sn_teams', indicating the team the user belongs to.
    dispatch_id VARCHAR(255),        -- Identifier for dispatching purposes, if applicable.
    snowy_role VARCHAR(255),         -- Role of the user within the Snowy application.
    company_role VARCHAR(255),       -- Role of the user within their company.
    import_id CHAR(36),
    PRIMARY KEY (user_id)
    FOREIGN KEY (team) REFERENCES sn_teams(team_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);

-- Table: sn_teams
-- This table stores information about teams within the organization.
CREATE TABLE IF NOT EXISTS sn_teams (
    team_id CHAR(36) NOT NULL,       -- Unique identifier for each team.
    team_name VARCHAR(255),          -- Name of the team.
    team_description VARCHAR(255),   -- Description of the team's purpose and role.
    import_id CHAR(36),
    PRIMARY KEY (team_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);

-- Table: sn_job_statuses
-- This table defines various statuses that can be assigned to jobs.
CREATE TABLE IF NOT EXISTS sn_job_statuses (
    job_status_id CHAR(36) NOT NULL, -- Unique identifier for each job status.
    job_status_name VARCHAR(255),    -- Name of the job status.
    job_status_code VARCHAR(255),    -- Code associated with the job status.
    import_id CHAR(36),
    PRIMARY KEY (job_status_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)

);

-- Table: sn_import_events
-- This table logs import events, such as data imports, and links them to users.
CREATE TABLE IF NOT EXISTS sn_import_events (
    import_id CHAR(36) NOT NULL,     -- Unique identifier for each import event.
    import_date DATE,                -- Date of the import event.
    user_id CHAR(36),                -- Foreign key to 'sn_users', identifying the user who performed the import.
    import_ref VARCHAR(255),         -- Reference identifier for the import event.
    import_source VARCHAR(255),      -- Source of the imported data.
    import_notes TEXT,               -- Additional notes or comments about the import event.
    PRIMARY KEY (import_id),
    FOREIGN KEY (user_id) REFERENCES sn_users(user_id)
);


-- Table: sn_slots
-- This table manages time slots for jobs, ensuring proper scheduling.
CREATE TABLE IF NOT EXISTS sn_slots (
    slot_id CHAR(36) NOT NULL,       -- Unique identifier for each slot.
    date DATE,                       -- Date for the slot.
    location_slot INT,               -- Location identifier for the slot.
    time_slot INT,                   -- Time identifier for the slot.
    job_id CHAR(36),                 -- Foreign key to 'sn_jobs', linking the slot to a specific job.
    import_id CHAR(36),
    PRIMARY KEY (slot_id),
    FOREIGN KEY (job_id) REFERENCES sn_jobs(job_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);



-- This table details the sites where projects are located, including address and contact information for site managers and DNO responsible.
CREATE TABLE IF NOT EXISTS sn_sites (
    site_id CHAR(36) NOT NULL,        -- Unique identifier for the site.
    project_id CHAR(36),              -- Project ID, linking the site to a specific project in sn_projects.
    dno_details_id INT,               -- DNO details ID, linking to the sn_dno_details table.
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

-- This table contains details about Distribution Network Operators (DNOs), including contact information.
CREATE TABLE IF NOT EXISTS sn_dno_details (
    dno_details_id INT NOT NULL AUTO_INCREMENT, -- Auto-incrementing ID for each DNO entry.
    mpan_prefix INT UNIQUE,                     -- Unique MPAN prefix associated with the DNO.
    dno_name VARCHAR(255),                      -- Name of the DNO.
    address VARCHAR(255),                       -- Address of the DNO.
    email_address VARCHAR(255),                 -- Email address for contacting the DNO.
    contact_no VARCHAR(255),                    -- Contact phone number for the DNO.
    internal_tel VARCHAR(255),                  -- Internal telephone number, if applicable.
    type VARCHAR(255),                          -- Type of DNO.
    import_id CHAR(36),
    PRIMARY KEY (dno_details_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);


-- This table holds information about different regions, potentially for project allocation and management.
CREATE TABLE IF NOT EXISTS sn_region (
    region_id CHAR(36) NOT NULL,    -- Unique identifier for each region.
    region_number INT,              -- Numerical representation of the region.
    region_name VARCHAR(255),       -- Name of the region.
    import_id CHAR(36),
    PRIMARY KEY (region_id),
    FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id)
);
