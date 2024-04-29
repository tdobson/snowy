-- sn_import_events
CREATE INDEX idx_sn_import_events_imported_by ON sn_import_events (imported_by);
CREATE INDEX idx_sn_import_events_modified_by ON sn_import_events (modified_by);

-- sn_users
CREATE INDEX idx_sn_users_email ON sn_users (email);
CREATE INDEX idx_sn_users_team ON sn_users (team);
CREATE INDEX idx_sn_users_import_id ON sn_users (import_id);

-- sn_projects
CREATE INDEX idx_sn_projects_client_id ON sn_projects (client_id);
CREATE INDEX idx_sn_projects_dno_details_id ON sn_projects (dno_details_id);
CREATE INDEX idx_sn_projects_region_id ON sn_projects (region_id);
CREATE INDEX idx_sn_projects_site_id ON sn_projects (site_id);
CREATE INDEX idx_sn_projects_import_id ON sn_projects (import_id);
CREATE INDEX idx_sn_projects_project_process_id ON sn_projects (project_process_id);
CREATE INDEX idx_sn_projects_pv_number ON sn_projects (pv_number);


-- sn_project_process
CREATE INDEX idx_sn_project_process_approval_status ON sn_project_process (approval_status);
CREATE INDEX idx_sn_project_process_dno_status ON sn_project_process (dno_status);
CREATE INDEX idx_sn_project_process_import_id ON sn_project_process (import_id);

-- sn_plots
CREATE INDEX idx_sn_plots_project_id ON sn_plots (project_id);
CREATE INDEX idx_sn_plots_plot_install_id ON sn_plots (plot_install_id);
CREATE INDEX idx_sn_plots_plot_status ON sn_plots (plot_status);
CREATE INDEX idx_sn_plots_site_id ON sn_plots (site_id);
CREATE INDEX idx_sn_plots_plot_address_id ON sn_plots (plot_address_id);
CREATE INDEX idx_sn_plots_import_id ON sn_plots (import_id);
CREATE INDEX idx_sn_plots_tracker_ref ON sn_plots (tracker_ref);
CREATE INDEX idx_sn_plots_plot_number ON sn_plots (plot_number);

-- sn_plot_spec
CREATE INDEX idx_sn_plot_spec_plot_id ON sn_plot_spec (plot_id);
CREATE INDEX idx_sn_plot_spec_specified_by ON sn_plot_spec (specified_by);
CREATE INDEX idx_sn_plot_spec_plot_spec_status ON sn_plot_spec (plot_spec_status);
CREATE INDEX idx_sn_plot_spec_meter ON sn_plot_spec (meter);
CREATE INDEX idx_sn_plot_spec_battery ON sn_plot_spec (battery);
CREATE INDEX idx_sn_plot_spec_import_id ON sn_plot_spec (import_id);

-- sn_clients
CREATE INDEX idx_sn_clients_client_address_id ON sn_clients (client_address_id);
CREATE INDEX idx_sn_clients_contact_id ON sn_clients (contact_id);
CREATE INDEX idx_sn_clients_import_id ON sn_clients (import_id);

-- sn_plot_install
CREATE INDEX idx_sn_plot_install_plot_id ON sn_plot_install (plot_id);
CREATE INDEX idx_sn_plot_install_install_by ON sn_plot_install (install_by);
CREATE INDEX idx_sn_plot_install_checked_by ON sn_plot_install (checked_by);
CREATE INDEX idx_sn_plot_install_plot_install_status ON sn_plot_install (plot_install_status);
CREATE INDEX idx_sn_plot_install_meter ON sn_plot_install (meter);
CREATE INDEX idx_sn_plot_install_battery ON sn_plot_install (battery);
CREATE INDEX idx_sn_plot_install_mcs_submission_id ON sn_plot_install (mcs_submission_id);
CREATE INDEX idx_sn_plot_install_import_id ON sn_plot_install (import_id);

-- sn_elevations_spec
CREATE INDEX idx_sn_elevations_spec_plot_spec_id ON sn_elevations_spec (plot_spec_id);
CREATE INDEX idx_sn_elevations_spec_plot_id ON sn_elevations_spec (plot_id);
CREATE INDEX idx_sn_elevations_spec_inverter ON sn_elevations_spec (inverter);
CREATE INDEX idx_sn_elevations_spec_panel ON sn_elevations_spec (panel);
CREATE INDEX idx_sn_elevations_spec_roof_kit ON sn_elevations_spec (roof_kit);
CREATE INDEX idx_sn_elevations_spec_import_id ON sn_elevations_spec (import_id);

-- sn_elevations_install
CREATE INDEX idx_sn_elevations_install_plot_install_id ON sn_elevations_install (plot_install_id);
CREATE INDEX idx_sn_elevations_install_plot_id ON sn_elevations_install (plot_id);
CREATE INDEX idx_sn_elevations_install_inverter ON sn_elevations_install (inverter);
CREATE INDEX idx_sn_elevations_install_panel ON sn_elevations_install (panel);
CREATE INDEX idx_sn_elevations_install_roof_kit ON sn_elevations_install (roof_kit);
CREATE INDEX idx_sn_elevations_install_import_id ON sn_elevations_install (import_id);

-- sn_form_submissions
CREATE INDEX idx_sn_form_submissions_plot_id ON sn_form_submissions (plot_id);
CREATE INDEX idx_sn_form_submissions_job_id ON sn_form_submissions (job_id);
CREATE INDEX idx_sn_form_submissions_import_id ON sn_form_submissions (import_id);

-- sn_jobs
CREATE INDEX idx_sn_jobs_plot_id ON sn_jobs (plot_id);
CREATE INDEX idx_sn_jobs_project_id ON sn_jobs (project_id);
CREATE INDEX idx_sn_jobs_user_id ON sn_jobs (user_id);
CREATE INDEX idx_sn_jobs_slot_id ON sn_jobs (slot_id);
CREATE INDEX idx_sn_jobs_job_status ON sn_jobs (job_status);
CREATE INDEX idx_sn_jobs_submission_id ON sn_jobs (submission_id);
CREATE INDEX idx_sn_jobs_dispatched_by ON sn_jobs (dispatched_by);
CREATE INDEX idx_sn_jobs_returned_by ON sn_jobs (returned_by);
CREATE INDEX idx_sn_jobs_dispatch_team ON sn_jobs (dispatch_team);
CREATE INDEX idx_sn_jobs_import_id ON sn_jobs (import_id);

-- sn_teams
CREATE INDEX idx_sn_teams_import_id ON sn_teams (import_id);

-- sn_status
CREATE INDEX idx_sn_status_import_id ON sn_status (import_id);

-- sn_slots
CREATE INDEX idx_sn_slots_job_id ON sn_slots (job_id);
CREATE INDEX idx_sn_slots_import_id ON sn_slots (import_id);

-- sn_addresses
CREATE INDEX idx_sn_addresses_address_region_id ON sn_addresses (address_region_id);
CREATE INDEX idx_sn_addresses_import_id ON sn_addresses (import_id);

-- sn_sites
CREATE INDEX idx_sn_sites_dno_details_id ON sn_sites (dno_details_id);
CREATE INDEX idx_sn_sites_site_address_id ON sn_sites (site_address_id);
CREATE INDEX idx_sn_sites_site_manager_id ON sn_sites (site_manager_id);
CREATE INDEX idx_sn_sites_site_surveyor_id ON sn_sites (site_surveyor_id);
CREATE INDEX idx_sn_sites_site_agent_id ON sn_sites (site_agent_id);
CREATE INDEX idx_sn_sites_import_id ON sn_sites (import_id);

-- sn_dno_details
CREATE INDEX idx_sn_dno_details_import_id ON sn_dno_details (import_id);

-- sn_region
CREATE INDEX idx_sn_region_import_id ON sn_region (import_id);

-- sn_products
CREATE INDEX idx_sn_products_import_id ON sn_products (import_id);

-- sn_custom_fields
CREATE INDEX idx_sn_custom_fields_entity_type ON sn_custom_fields (entity_type);
CREATE INDEX idx_sn_custom_fields_entity_id ON sn_custom_fields (entity_id);
CREATE INDEX idx_sn_custom_fields_field_name ON sn_custom_fields (field_name);
CREATE INDEX idx_sn_custom_fields_import_id ON sn_custom_fields (import_id);

CREATE INDEX idx_sn_custom_fields_entity_type_entity_id_field_name ON sn_custom_fields (entity_type, entity_id, field_name);
CREATE INDEX idx_sn_custom_fields_entity_type_entity_id ON sn_custom_fields (entity_type, entity_id);
CREATE INDEX idx_sn_custom_fields_entity_type_field_name ON sn_custom_fields (entity_type, field_name);

-- sn_instances
CREATE INDEX idx_sn_instances_instance_key_contact ON sn_instances (instance_key_contact);
CREATE INDEX idx_sn_instances_import_id ON sn_instances (import_id);

-- sn_mcs_submission
CREATE INDEX idx_sn_mcs_submission_mcs_submit_status ON sn_mcs_submission (mcs_submit_status);
CREATE INDEX idx_sn_mcs_submission_submission_checked_by ON sn_mcs_submission (submission_checked_by);
CREATE INDEX idx_sn_mcs_submission_submitted_by ON sn_mcs_submission (submitted_by);
CREATE INDEX idx_sn_mcs_submission_import_id ON sn_mcs_submission (import_id);

-- sn_mcs_ref_counties
CREATE INDEX idx_sn_mcs_ref_counties_import_id ON sn_mcs_ref_counties (import_id);
