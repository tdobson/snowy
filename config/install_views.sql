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
    a.address_line_1, a.address_line_2, a.address_town, a.address_county, a.address_postcode, a.address_country, a.address_region_id, p.instance_id
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
    a.address_line_1, a.address_line_2, a.address_town, a.address_county, a.address_postcode, a.address_country, a.address_region_id, pr.instance_id
FROM
    sn_projects pr
    LEFT JOIN sn_project_process pp ON pr.project_process_id = pp.project_process_id
    LEFT JOIN sn_clients c ON pr.client_id = c.client_id
    LEFT JOIN sn_status st ON pp.approval_status = st.status_id
    LEFT JOIN sn_sites s ON pr.site_id = s.site_id
    LEFT JOIN sn_addresses a ON c.client_address_id = a.address_id;

create VIEW sn_vw_project_info_for_tracker AS
SELECT
    p.project_id,
    p.pv_number AS projectNo,
    s.site_name AS site,
    c.client_name AS clientName,
    a.address_line_1 AS siteAddress,
    a.address_postcode AS sitePostcode,
    cf.field_value AS sitew3w,
    u1.name AS surveyorName,
    u1.phone AS surveyorTel,
    u1.email AS surveyorEmail,
    u2.name AS siteAgentName,
    u2.phone AS siteAgentTel,
    u2.email AS siteAgentEmail,
    p.instance_id AS instanceId
FROM sn_projects p
JOIN sn_sites s ON p.site_id = s.site_id
JOIN sn_clients c ON p.client_id = c.client_id
JOIN sn_addresses a ON s.site_address_id = a.address_id
LEFT JOIN sn_custom_fields cf ON s.site_id = cf.entity_id AND cf.field_name = 'sitew3w'
LEFT JOIN sn_users u1 ON s.site_surveyor_id = u1.user_id
LEFT JOIN sn_users u2 ON s.site_agent_id = u2.user_id;

create VIEW sn_vw_plot_details_for_tracker AS
SELECT
    p.plot_id,
    pr.pv_number as "Job Code",
    p.plot_number,
    p.housetype,
    a.address_line_1 AS house_no,
    a.address_line_2 AS street,
    a.address_town AS town,
    a.address_postcode AS postcode,
    p.mpan,
    es.panel,
    es.panel_cost AS panelkwp,
    es.type_test_ref AS mcscode,
    es.orientation,
    es.strings AS columns,
    es.module_qty AS `rows`,
    ps.phase,
    es.strings AS totalstrings,
    ef1.field_value AS string1,
    ef2.field_value AS string2,
    ef3.field_value AS string3,
    ef4.field_value AS string4,
    es.inverter,
    ef5.field_value AS trackerstringno,
    ef6.field_value AS inverterhybrid,
    es.type_test_ref AS typetestno,
    ef7.field_value AS ratedoutputpower,
    ps.battery,
    es.roof_kit AS mountingkit,
    ef8.field_value AS tiletype,
    es.pitch AS roofincline,
    ef9.field_value AS variationfromsouth,
    ef10.field_value AS kwhperkwp,
    ef6.field_value AS inaboveroof,
    ef11.field_value AS overshadingfactor,
    es.module_qty AS nopanels,
    ef12.field_value AS arraym2,
    es.kwp,
    ef13.field_value AS kwh,
    ef14.field_value AS co2equivalent,
    ps.kwp AS netkwp,
    ps.meter AS metermake,
    pcf.field_value AS metermodel,
    ps.overall_cost AS totalcost,
    pcf2.field_value AS totalprice,
    pcf3.field_value AS givenergy,
    p.instance_id AS instanceId
FROM
    sn_plots p
    LEFT JOIN sn_projects pr ON p.project_id = pr.project_id
    LEFT JOIN sn_plot_spec ps ON p.plot_id = ps.plot_id
    LEFT JOIN sn_elevations_spec es ON p.plot_id = es.plot_id
    LEFT JOIN sn_addresses a ON p.plot_address_id = a.address_id
    LEFT JOIN sn_custom_fields ef1 ON ps.plot_spec_id = ef1.entity_id AND ef1.entity_type = 'plotSpec' AND ef1.field_name = 'String_one'
    LEFT JOIN sn_custom_fields ef2 ON ps.plot_spec_id = ef2.entity_id AND ef2.entity_type = 'plotSpec' AND ef2.field_name = 'String_two'
    LEFT JOIN sn_custom_fields ef3 ON ps.plot_spec_id = ef3.entity_id AND ef3.entity_type = 'plotSpec' AND ef3.field_name = 'String_three'
    LEFT JOIN sn_custom_fields ef4 ON ps.plot_spec_id = ef4.entity_id AND ef4.entity_type = 'plotSpec' AND ef4.field_name = 'String_four'
    LEFT JOIN sn_custom_fields ef5 ON ps.plot_spec_id = ef5.entity_id AND ef5.entity_type = 'plotSpec' AND ef5.field_name = 'NO_Trackers'
    LEFT JOIN sn_custom_fields ef6 ON es.elevation_spec_id = ef6.entity_id AND ef6.entity_type = 'elevationSpec' AND ef6.field_name = 'IN___ABOVE_ROOF'
    LEFT JOIN sn_custom_fields ef7 ON es.elevation_spec_id = ef7.entity_id AND ef7.entity_type = 'elevationSpec' AND ef7.field_name = 'Rated_Output__W_'
    LEFT JOIN sn_custom_fields ef8 ON es.elevation_spec_id = ef8.entity_id AND ef8.entity_type = 'elevationSpec' AND ef8.field_name = 'Tile_Type'
    LEFT JOIN sn_custom_fields ef9 ON es.elevation_spec_id = ef9.entity_id AND ef9.entity_type = 'elevationSpec' AND ef9.field_name = 'Input_Variation_from_South'
    LEFT JOIN sn_custom_fields ef10 ON es.elevation_spec_id = ef10.entity_id AND ef10.entity_type = 'elevationSpec' AND ef10.field_name = 'kWh_KWp'
    LEFT JOIN sn_custom_fields ef11 ON es.elevation_spec_id = ef11.entity_id AND ef11.entity_type = 'elevationSpec' AND ef11.field_name = 'OVERSHADING_FACTOR'
    LEFT JOIN sn_custom_fields ef12 ON es.elevation_spec_id = ef12.entity_id AND ef12.entity_type = 'elevationSpec' AND ef12.field_name = 'ARRAY_Mtwo'
    LEFT JOIN sn_custom_fields ef13 ON es.elevation_spec_id = ef13.entity_id AND ef13.entity_type = 'elevationSpec' AND ef13.field_name = 'kWh'
    LEFT JOIN sn_custom_fields ef14 ON es.elevation_spec_id = ef14.entity_id AND ef14.entity_type = 'elevationSpec' AND ef14.field_name = 'COtwo_EQUIVALENT'
    LEFT JOIN sn_custom_fields ef15 ON es.elevation_spec_id = ef15.entity_id AND ef15.entity_type = 'elevationSpec' AND ef15.field_name = 'Net_kWp'
    LEFT JOIN sn_custom_fields pcf ON ps.plot_spec_id = pcf.entity_id AND pcf.entity_type = 'plotSpec' AND pcf.field_name = 'Model_Number'
    LEFT JOIN sn_custom_fields pcf2 ON ps.plot_spec_id = pcf2.entity_id AND pcf2.entity_type = 'plotSpec' AND pcf2.field_name = 'Plot_Total__Quoted_'
    LEFT JOIN sn_custom_fields pcf3 ON ps.plot_spec_id = pcf3.entity_id AND pcf3.entity_type = 'plotSpec' AND pcf3.field_name = 'GIVENERGY';

alter VIEW sn_vw_plot_elevation_details_for_tracker AS
SELECT
    p.plot_id,
    pr.pv_number as "Job Code",
    MAX(CASE WHEN es.elevation_spec_id IS NOT NULL THEN es.elevation_spec_id END) AS `Elevation Spec ID`,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'elevationNumber' THEN cf.field_value END) AS "Elevation Number",
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Elevation_No' THEN cf.field_value END) AS "Elevation_No",
    MAX(CASE WHEN p.plot_number IS NOT NULL THEN p.plot_number END) AS `PLOT NO`,
    MAX(CASE WHEN p.housetype IS NOT NULL THEN p.housetype END) AS Housetype,
    MAX(CASE WHEN a.address_line_1 IS NOT NULL THEN a.address_line_1 END) AS `House No/name`,
    MAX(CASE WHEN a.address_line_2 IS NOT NULL THEN a.address_line_2 END) AS Street,
    MAX(CASE WHEN a.address_town IS NOT NULL THEN a.address_town END) AS Town,
    MAX(CASE WHEN a.address_postcode IS NOT NULL THEN a.address_postcode END) AS Postcode,
    MAX(CASE WHEN p.mpan IS NOT NULL THEN p.mpan END) AS MPAN,
    MAX(CASE WHEN productspanel.product_name IS NOT NULL THEN productspanel.product_name END) AS Panel,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Wattage' THEN cf.field_value END) AS `PANEL kWp`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Voltage' THEN cf.field_value END) AS `P Voltage`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'MCS_Code' THEN cf.field_value END) AS `MCS Code`,
    MAX(CASE WHEN es.orientation IS NOT NULL THEN es.orientation END) AS Orientation,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Columns' THEN cf.field_value END) AS `Columns`,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Rows' THEN cf.field_value END) AS `Rows`,
    MAX(CASE WHEN ps.phase IS NOT NULL THEN ps.phase END) AS Phase,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'NO_Trackers' THEN cf.field_value END) AS `NO Trackers`,
    MAX(CASE WHEN es.strings IS NOT NULL THEN es.strings END) AS `Total Strings`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_one' THEN cf.field_value END) AS `String 1`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_two' THEN cf.field_value END) AS `String 2`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_three' THEN cf.field_value END) AS `String 3`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_four' THEN cf.field_value END) AS `String 4`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_five' THEN cf.field_value END) AS `String 5`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_six' THEN cf.field_value END) AS `String 6`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_seven' THEN cf.field_value END) AS `String 7`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'String_eight' THEN cf.field_value END) AS `String 8`,
    MAX(CASE WHEN productsinverters.product_name IS NOT NULL THEN productsinverters.product_name END) AS `Inverter`,
    '' AS `Tracker/String no.`,
    MAX(CASE WHEN productsinverters.manufacturer IS NOT NULL THEN productsinverters.manufacturer END) AS `Inverter Manufacturer`,
    '' AS `Hybrid`,
    MAX(CASE WHEN es.type_test_ref IS NOT NULL THEN es.type_test_ref END) AS `Type Test No`,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Inverter_Rated_Output__W_' THEN cf.field_value END) AS `Rated Output Power`,
    MAX(CASE WHEN productsbattery.product_name IS NOT NULL THEN productsbattery.product_name END) AS Battery,
    MAX(CASE WHEN productsroofkit.product_name IS NOT NULL THEN productsroofkit.product_name END) AS `Mounting Kit`, -- error
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Tile_Type' THEN cf.field_value END) AS `Tile Type`,
    MAX(CASE WHEN es.pitch IS NOT NULL THEN es.pitch END) AS `Roof Incline`,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Input_Variation_from_South' THEN cf.field_value END) AS `Variationo From South`,
    MAX(CASE WHEN es.kk_figure IS NOT NULL THEN es.kk_figure END) AS `kWh/kWp`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'IN___ABOVE_ROOF' THEN cf.field_value END) AS `IN / ABOVE ROOF`,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'CARDINAL_DIRECTION' THEN cf.field_value END) AS `CARDINAL DIRECTION`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'OVERSHADING_FACTOR' THEN cf.field_value END) AS `OVERSHADING FACTOR`,
    MAX(CASE WHEN es.module_qty IS NOT NULL THEN es.module_qty END) AS `NO# PANELS`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'ARRAY_Mtwo' THEN cf.field_value END) AS `ARRAY M2`,
    MAX(CASE WHEN es.kwp IS NOT NULL THEN es.kwp END) AS kWp,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'kWh' THEN cf.field_value END) AS kWh,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'COtwo_EQUIVALENT' THEN cf.field_value END) AS `CO2 EQUIVALENT`,
    MAX(CASE WHEN ps.kwp IS NOT NULL THEN ps.kwp END) AS `Net kWp`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Finished_Drawing' THEN cf.field_value END) AS `Finished Drawing`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Commissioning_Info_In' THEN cf.field_value END) AS `Commissioning Info In`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'MCS_Completed' THEN cf.field_value END) AS `MCS Completed`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'DNO_Document_Completed' THEN cf.field_value END) AS `DNO Document Completed`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'HO_Pack_Completed' THEN cf.field_value END) AS `HO Pack Completed`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Shape' THEN cf.field_value END) AS Shape,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'MICROINV' THEN cf.field_value END) AS `Inverter Mauf`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Protective_Device' THEN cf.field_value END) AS `Protective Device`,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Building_Side' THEN cf.field_value END) AS `Building Side`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'PARCEL' THEN cf.field_value END) AS Parcel,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Block___House' THEN cf.field_value END) AS `Block/house`,
    MAX(CASE WHEN cf.entity_type = 'plotSpec' AND cf.field_name = 'Plot_Requirement' THEN cf.field_value END) AS `Plot requirement`,
    p.instance_id AS instanceId
FROM
    sn_plots p
    LEFT JOIN sn_projects pr ON p.project_id = pr.project_id
    LEFT JOIN sn_plot_spec ps ON p.plot_id = ps.plot_id
    LEFT JOIN sn_elevations_spec es ON p.plot_id = es.plot_id
    LEFT JOIN sn_addresses a ON p.plot_address_id = a.address_id
    LEFT JOIN sn_products productsinverters ON productsinverters.product_id = es.inverter
    LEFT JOIN sn_products productspanel ON productspanel.product_id = es.panel
    LEFT JOIN sn_products productsroofkit ON productsroofkit.product_id = es.roof_kit
    LEFT JOIN sn_products productsbattery ON productsbattery.product_id = ps.battery
    LEFT JOIN sn_products productsmeter ON productsmeter.product_id = ps.meter
    LEFT JOIN sn_custom_fields cf ON (cf.entity_id = ps.plot_spec_id AND cf.entity_type = 'plotSpec') OR (cf.entity_id = es.elevation_spec_id AND cf.entity_type = 'elevationSpec')
GROUP BY
    p.plot_id
ORDER BY
    p.plot_number,
    p.plot_id,
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'Elevation_No' THEN cf.field_value END),
    MAX(CASE WHEN cf.entity_type = 'elevationSpec' AND cf.field_name = 'elevationNumber' THEN cf.field_value END),
    es.elevation_spec_id;


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
