
-- Table: sn_form_submissions
CREATE TABLE IF NOT EXISTS sn_form_submissions (
    submission_id CHAR(36) NOT NULL,
    plot_id CHAR(36),
    site_id CHAR(36),
    product_id CHAR(36),
    PRIMARY KEY (submission_id),
    FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    FOREIGN KEY (site_id) REFERENCES sn_sites(site_id),
    FOREIGN KEY (product_id) REFERENCES sn_products(product_id)
);

-- Table: sn_users
CREATE TABLE IF NOT EXISTS sn_users (
    user_id CHAR(36) NOT NULL,
    sso_id VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    employer VARCHAR(255),
    team CHAR(36),
    dispatch_id VARCHAR(255),
    snowy_role VARCHAR(255),
    company_role VARCHAR(255),
    PRIMARY KEY (user_id)
);

-- Table: sn_teams
CREATE TABLE IF NOT EXISTS sn_teams (
    team_id CHAR(36) NOT NULL,
    team_name VARCHAR(255),
    team_description VARCHAR(255),
    PRIMARY KEY (team_id)
);

-- Table: sn_job_statuses
CREATE TABLE IF NOT EXISTS sn_job_statuses (
    job_status_id CHAR(36) NOT NULL,
    job_status_name VARCHAR(255),
    job_status_code VARCHAR(255),
    PRIMARY KEY (job_status_id)
);

-- Table: sn_import_events
CREATE TABLE IF NOT EXISTS sn_import_events (
    import_id CHAR(36) NOT NULL,
    import_date DATE,
    user_id CHAR(36),
    import_ref VARCHAR(255),
    import_source VARCHAR(255),
    import_notes TEXT,
    PRIMARY KEY (import_id),
    FOREIGN KEY (user_id) REFERENCES sn_users(user_id)
);

-- Table: sn_jobs
CREATE TABLE IF NOT EXISTS sn_jobs (
    job_id CHAR(36) NOT NULL,
    plot_id CHAR(36),
    plot_number VARCHAR(255),
    project_number VARCHAR(255),
    project_id CHAR(36),
    dispatch_id VARCHAR(255),
    submission_id CHAR(36),
    dispatched_at DATE,
    dispatched_by CHAR(36),
    returned_at DATE,
    returned_by CHAR(36),
    dispatch_team CHAR(36),
    status CHAR(36),
    user_id CHAR(36),
    slot_id CHAR(36),
    PRIMARY KEY (job_id),
    FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    FOREIGN KEY (dispatched_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (returned_by) REFERENCES sn_users(user_id),
    FOREIGN KEY (status) REFERENCES sn_job_statuses(job_status_id),
    FOREIGN KEY (user_id) REFERENCES sn_users(user_id),
    FOREIGN KEY (slot_id) REFERENCES sn_slots(slot_id)
);

-- Table: sn_slots
CREATE TABLE IF NOT EXISTS sn_slots (
    slot_id CHAR(36) NOT NULL,
    date DATE,
    location_slot INT,
    time_slot INT,
    job_id CHAR(36),
    PRIMARY KEY (slot_id),
    FOREIGN KEY (job_id) REFERENCES sn_jobs(job_id)
);



