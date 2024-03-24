CREATE VIEW sn_vw_plot_details AS
SELECT
    p.plot_id, p.plot_number, p.plot_status, p.site_id, p.housetype, p.g99, p.mpan, p.plot_approved, p.commissioning_form_submitted,
    ps.date_specified, ps.specified_by, ps.plot_spec_status, ps.phase, ps.p1, ps.p2, ps.p3, ps.annual_yield, ps.kwp, ps.kwp_with_limitation,
    ps.limiter_required, ps.limiter_value_if_not_zero, ps.labour_cost, ps.meter, ps.meter_cost, ps.battery, ps.battery_cost, ps.overall_cost, ps.landlord_supply,
    pi.date_install, pi.date_checked, pi.install_by, pi.checked_by, pi.plot_install_status,
    es.type_test_ref, es.pitch, es.orientation, es.kk_figure, es.kwp AS elevation_kwp, es.strings, es.module_qty, es.inverter, es.inverter_cost,
    es.panel, es.panel_cost, es.panels_total_cost, es.roof_kit, es.roof_kit_cost, es.annual_yield AS elevation_annual_yield,
    ei.type_test_ref AS install_type_test_ref, ei.pitch AS install_pitch, ei.orientation AS install_orientation, ei.kk_figure AS install_kk_figure,
    ei.kwp AS install_elevation_kwp, ei.strings AS install_strings, ei.module_qty AS install_module_qty, ei.inverter AS install_inverter,
    ei.inverter_cost AS install_inverter_cost, ei.panel AS install_panel, ei.panel_cost AS install_panel_cost,
    ei.panels_total_cost AS install_panels_total_cost, ei.roof_kit AS install_roof_kit, ei.roof_kit_cost AS install_roof_kit_cost,
    ei.annual_yield AS install_elevation_annual_yield,
    st.status_state, st.status_name, st.status_group, st.status_code, st.status_description,
    a.address_line_1, a.address_line_2, a.address_town, a.address_county, a.address_postcode, a.address_country, a.address_region_id
FROM
    sn_plots p
    LEFT JOIN sn_plot_spec ps ON p.plot_id = ps.plot_id
    LEFT JOIN sn_plot_install pi ON p.plot_id = pi.plot_id
    LEFT JOIN sn_elevations_spec es ON p.plot_id = es.plot_id
    LEFT JOIN sn_elevations_install ei ON p.plot_id = ei.plot_id
    LEFT JOIN sn_status st ON p.plot_status = st.status_id
    LEFT JOIN sn_addresses a ON p.plot_address_id = a.address_id;

CREATE VIEW sn_vw_project_details AS
SELECT
    pr.project_id, pr.client_id, pr.pv_number, pr.dno_details_id, pr.region_id, pr.site_id, pr.ref_number, pr.project_name, pr.job_code, pr.comments,
    pr.project_process_id, pr.dno_zone,
    pp.approval_status, pp.deadline_to_connect, pp.auth_letter_sent, pp.mpan_request_sent, pp.schematic_created, pp.application_type,
    pp.formal_dno_submitted, pp.submission_date, pp.dno_due_date, pp.dno_status, pp.approved_kwp, pp.quote_received, pp.customer_invoiced_date,
    pp.dno_payment_made, pp.acceptance_form_returned, pp.date_approved,
    c.client_legacy_number, c.client_name, c.client_address_id, c.client_plot_card_required, c.contact_id,
    st.status_state, st.status_name, st.status_group, st.status_code, st.status_description,
    s.site_name, s.dno_details_id AS site_dno_details_id, s.site_address_id, s.site_manager_id, s.site_surveyor_id, s.site_agent_id,
    a.address_line_1, a.address_line_2, a.address_town, a.address_county, a.address_postcode, a.address_country, a.address_region_id
FROM
    sn_projects pr
    LEFT JOIN sn_project_process pp ON pr.project_process_id = pp.project_process_id
    LEFT JOIN sn_clients c ON pr.client_id = c.client_id
    LEFT JOIN sn_status st ON pp.approval_status = st.status_id
    LEFT JOIN sn_sites s ON pr.site_id = s.site_id
    LEFT JOIN sn_addresses a ON c.client_address_id = a.address_id;


    -- this view provides the info requires to submit to the MCS api
    CREATE VIEW sn_vw_mcs_submission_details AS
    SELECT
        ms.mcs_loaded_date AS 'Date Loaded', -- Assuming 'Date Loaded' is the import date of the project
        ms.mcs_submit_status AS 'Approved For Certificate', -- Status indicating whether the project is approved for MCS certificate
        p.pv_number AS 'Project Number', -- Unique project number
        pl.plot_number AS 'Plot Number', -- Plot number within the project
        pi.date_install AS 'Commissioning Date', -- Date when the plot was installed
        pl.mpan AS 'MPAN', -- MPAN number for the plot
        s.site_address_line_1 AS 'AddressLine1', -- Site address line 1
        s.site_address_line_2 AS 'AddressLine2', -- Site address line 2
        s.site_address_line_3 AS 'AddressLine3', -- Site address line 3
        s.site_county AS 'CountyID', -- County of the site
        s.site_postcode AS 'Postcode', -- Postcode of the site
        -- 'CountryID' - Country ID of the site (not present in schema)
        ps.kwp AS 'Total Capacity', -- Total kilowatt-peak capacity of the plot
        pi.overall_cost AS 'Overall Cost', -- Overall cost of installation for the plot
        -- 'ProjectNumber' - Redundant with 'Project Number', or may indicate a different identifier
        -- 'InstallationTypeID' - Type of installation (not present in schema)
        -- 'PitchedRoofInstallationID' - Specific identifier for pitched roof installations (not present in schema)
        -- 'Product Name 1', 'Product ID 1', 'Product Count 1' (and similarly for 2, 3, 4) - Specific product details used in the plot (not present in schema, would require a junction table or similar)
        -- 'ConsumerEmailAddress' - Email address of the consumer (not present in schema)
        -- 'EstimatedAnnualGeneration' - Estimated annual energy generation (not present in schema)
        -- 'PlanningRegulationsComplied' - Compliance with planning regulations (not present in schema)
        -- 'BuildingRegulationsNotified' - Notification of building regulations (not present in schema)
        -- 'GreenDeal' - Green deal compliance or participation (not present in schema)
        -- 'DeclaredNetCapacity' - Declared net capacity of the installation (not present in schema)
        -- 'Standalone' - Indicates if the installation is standalone (not present in schema)
        -- 'GenerationMeterSerialNumber' - Serial number of the generation meter (not present in schema)
        -- 'GenerationMeterReading' - Reading of the generation meter (not present in schema)
        -- 'GenerationMeterMake' - Make of the generation meter (not present in schema)
        -- 'GenerationMeterModelNumber' - Model number of the generation meter (not present in schema)
        -- 'ConnectionToGridID' - Identifier for the connection to the grid (not present in schema)
        -- 'InverterLabel' - Label or identifier for the inverter (not present in schema)
        -- 'GenerationMeter' - Details about the generation meter (not present in schema)
    FROM
        sn_import_events ie
    JOIN sn_projects p ON ie.import_id = p.import_id
    JOIN sn_plots pl ON p.project_id = pl.project_id
    JOIN sn_sites s ON pl.site = s.site_id
    JOIN sn_plot_spec ps ON pl.plot_id = ps.plot_id
    JOIN sn_plot_install pi ON pl.plot_id = pi.plot_id
    JOIN sn_mcs_submission ms ON pi.plot_meta_id = ms.mcs_submission_id;
