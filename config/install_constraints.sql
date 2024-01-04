
-- Part 2: Alter Tables to Add Foreign Key Constraints

-- Alter sn_import_events
ALTER TABLE sn_import_events
    ADD FOREIGN KEY (imported_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (modified_by) REFERENCES sn_users(user_id);

-- Alter sn_users
ALTER TABLE sn_users
    ADD FOREIGN KEY (user_address_id) REFERENCES sn_addresses(address_id),
    ADD FOREIGN KEY (team) REFERENCES sn_teams(team_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_projects
ALTER TABLE sn_projects
    ADD FOREIGN KEY (client_id) REFERENCES sn_clients(client_id),
    ADD FOREIGN KEY (region_id) REFERENCES sn_region(region_id),
    ADD FOREIGN KEY (dno_details_id) REFERENCES sn_dno_details(dno_details_id),
    ADD FOREIGN KEY (site_id) REFERENCES sn_sites(site_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_project_process
ALTER TABLE sn_project_process
    ADD FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    ADD FOREIGN KEY (approval_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (dno_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);


-- Alter sn_plots to add foreign key constraints
ALTER TABLE sn_plots
    ADD FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    ADD FOREIGN KEY (site) REFERENCES sn_sites(site_id),
    ADD FOREIGN KEY (plot_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (plot_address_id) REFERENCES sn_addresses(address_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_plot_spec to add foreign key constraints
ALTER TABLE sn_plot_spec
    ADD FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    ADD FOREIGN KEY (specified_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (plot_spec_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (meter) REFERENCES sn_products(product_id),
    ADD FOREIGN KEY (battery) REFERENCES sn_products(product_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);


-- Alter sn_clients to add foreign key constraints
ALTER TABLE sn_clients
    ADD FOREIGN KEY (user_address_id) REFERENCES sn_addresses(address_id),
    ADD FOREIGN KEY (contact_id) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_plot_install to add foreign key constraints
ALTER TABLE sn_plot_install
    ADD FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    ADD FOREIGN KEY (install_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (checked_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (plot_install_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (meter) REFERENCES sn_products(product_id),
    ADD FOREIGN KEY (battery) REFERENCES sn_products(product_id),
    ADD FOREIGN KEY (mcs_submission_id) REFERENCES sn_mcs_submission(mcs_submission_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);


-- Alter sn_elevations to add foreign key constraints
ALTER TABLE sn_elevations
    ADD FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    ADD FOREIGN KEY (inverter) REFERENCES sn_products(product_id),
    ADD FOREIGN KEY (panel) REFERENCES sn_products(product_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    ADD FOREIGN KEY (roof_kit) REFERENCES sn_products(product_id);

-- Alter sn_form_submissions to add foreign key constraints
ALTER TABLE sn_form_submissions
    ADD FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    ADD FOREIGN KEY (job_id) REFERENCES sn_jobs(job_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);



-- Alter sn_jobs to add foreign key constraints
ALTER TABLE sn_jobs
    ADD FOREIGN KEY (plot_id) REFERENCES sn_plots(plot_id),
    ADD FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    ADD FOREIGN KEY (user_id) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (slot_id) REFERENCES sn_slots(slot_id),
    ADD FOREIGN KEY (job_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (dispatched_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (returned_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (dispatch_team) REFERENCES sn_teams(team_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    ADD FOREIGN KEY (submission_id) REFERENCES sn_form_submissions(submission_id);

-- Alter sn_teams to add foreign key constraints
ALTER TABLE sn_teams
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);



-- Alter sn_status to add foreign key constraints
ALTER TABLE sn_status
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_slots to add foreign key constraints
ALTER TABLE sn_slots
    ADD FOREIGN KEY (job_id) REFERENCES sn_jobs(job_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);


-- Alter sn_addresses to add foreign key constraints
ALTER TABLE sn_addresses
    ADD FOREIGN KEY (address_region_id) REFERENCES sn_regions(region_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_sites to add foreign key constraints
ALTER TABLE sn_sites
    ADD FOREIGN KEY (site_address_id) REFERENCES sn_addresses(address_id),
    ADD FOREIGN KEY (site_manager_id) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (project_id) REFERENCES sn_projects(project_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id),
    ADD FOREIGN KEY (dno_details_id) REFERENCES sn_dno_details(dno_details_id);

-- Alter sn_dno_details to add foreign key constraints
ALTER TABLE sn_dno_details
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);



-- Alter sn_region to add foreign key constraints
ALTER TABLE sn_region
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_products to add foreign key constraints
ALTER TABLE sn_products
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_mcs_submission to add foreign key constraints
ALTER TABLE sn_mcs_submission
    ADD FOREIGN KEY (submission_checked_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (submitted_by) REFERENCES sn_users(user_id),
    ADD FOREIGN KEY (mcs_submit_status) REFERENCES sn_status(status_id),
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);

-- Alter sn_mcs_ref_counties to add foreign key constraints
ALTER TABLE sn_mcs_ref_counties
    ADD FOREIGN KEY (import_id) REFERENCES sn_import_events(import_id);