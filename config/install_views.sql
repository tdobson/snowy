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
    pr.pv_number AS "Job Code",
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
    pscf.String_one AS string1,
    pscf.String_two AS string2,
    pscf.String_three AS string3,
    pscf.String_four AS string4,
    es.inverter,
    pscf.NO_Trackers AS trackerstringno,
    escf.IN___ABOVE_ROOF AS inverterhybrid,
    es.type_test_ref AS typetestno,
    escf.Rated_Output__W_ AS ratedoutputpower,
    ps.battery,
    es.roof_kit AS mountingkit,
    escf.Tile_Type AS tiletype,
    es.pitch AS roofincline,
    escf.Input_Variation_from_South AS variationfromsouth,
    escf.kWh_KWp AS kwhperkwp,
    escf.IN___ABOVE_ROOF AS inaboveroof,
    escf.OVERSHADING_FACTOR AS overshadingfactor,
    es.module_qty AS nopanels,
    escf.ARRAY_Mtwo AS arraym2,
    es.kwp,
    escf.kWh AS kwh,
    escf.COtwo_EQUIVALENT AS co2equivalent,
    ps.kwp AS netkwp,
    ps.meter AS metermake,
    pscf.Model_Number AS metermodel,
    ps.overall_cost AS totalcost,
    pscf.Plot_Total__Quoted_ AS totalprice,
    pscf.GIVENERGY AS givenergy,
    p.instance_id AS instanceId
FROM
    sn_plots p
    LEFT JOIN sn_projects pr ON p.project_id = pr.project_id
    LEFT JOIN sn_plot_spec ps ON p.plot_id = ps.plot_id
    LEFT JOIN sn_elevations_spec es ON p.plot_id = es.plot_id
    LEFT JOIN sn_addresses a ON p.plot_address_id = a.address_id
    LEFT JOIN (
        SELECT
            entity_id,
            MAX(CASE WHEN field_name = 'String_one' THEN field_value END) AS String_one,
            MAX(CASE WHEN field_name = 'String_two' THEN field_value END) AS String_two,
            MAX(CASE WHEN field_name = 'String_three' THEN field_value END) AS String_three,
            MAX(CASE WHEN field_name = 'String_four' THEN field_value END) AS String_four,
            MAX(CASE WHEN field_name = 'NO_Trackers' THEN field_value END) AS NO_Trackers,
            MAX(CASE WHEN field_name = 'Model_Number' THEN field_value END) AS Model_Number,
            MAX(CASE WHEN field_name = 'Plot_Total__Quoted_' THEN field_value END) AS Plot_Total__Quoted_,
            MAX(CASE WHEN field_name = 'GIVENERGY' THEN field_value END) AS GIVENERGY
        FROM
            sn_custom_fields
        WHERE
            entity_id IN (SELECT plot_spec_id FROM sn_plot_spec)
        GROUP BY
            entity_id
    ) pscf ON pscf.entity_id = ps.plot_spec_id
    LEFT JOIN (
        SELECT
            entity_id,
            MAX(CASE WHEN field_name = 'IN___ABOVE_ROOF' THEN field_value END) AS IN___ABOVE_ROOF,
            MAX(CASE WHEN field_name = 'Rated_Output__W_' THEN field_value END) AS Rated_Output__W_,
            MAX(CASE WHEN field_name = 'Tile_Type' THEN field_value END) AS Tile_Type,
            MAX(CASE WHEN field_name = 'Input_Variation_from_South' THEN field_value END) AS Input_Variation_from_South,
            MAX(CASE WHEN field_name = 'kWh_KWp' THEN field_value END) AS kWh_KWp,
            MAX(CASE WHEN field_name = 'OVERSHADING_FACTOR' THEN field_value END) AS OVERSHADING_FACTOR,
            MAX(CASE WHEN field_name = 'ARRAY_Mtwo' THEN field_value END) AS ARRAY_Mtwo,
            MAX(CASE WHEN field_name = 'kWh' THEN field_value END) AS kWh,
            MAX(CASE WHEN field_name = 'COtwo_EQUIVALENT' THEN field_value END) AS COtwo_EQUIVALENT
        FROM
            sn_custom_fields
        WHERE
            entity_id IN (SELECT elevation_spec_id FROM sn_elevations_spec)
        GROUP BY
            entity_id
    ) escf ON escf.entity_id = es.elevation_spec_id;


ALTER VIEW sn_vw_plot_elevation_details_for_tracker AS
SELECT
    p.plot_id,
    pr.pv_number AS "Job Code",
    es.elevation_spec_id AS `Elevation Spec ID`,
    escf.elevationNumber AS "Elevation Number",
    escf.Elevation_No AS "Elevation_No",
    p.plot_number AS `PLOT NO`,
    p.housetype AS Housetype,
    a.address_line_1 AS `House No/name`,
    a.address_line_2 AS Street,
    a.address_town AS Town,
    a.address_postcode AS Postcode,
    p.mpan AS MPAN,
    productspanel.product_name AS Panel,
    pscf.Wattage AS `PANEL kWp`,
    pscf.Voltage AS `P Voltage`,
    pscf.MCS_Code AS `MCS Code`,
    es.orientation AS Orientation,
    escf.`Columns` AS `Columns`,
    escf.`Rows` AS `Rows`,
    ps.phase AS Phase,
    pscf.NO_Trackers AS `NO Trackers`,
    es.strings AS `Total Strings`,
    pscf.String_one AS `String 1`,
    pscf.String_two AS `String 2`,
    pscf.String_three AS `String 3`,
    pscf.String_four AS `String 4`,
    pscf.String_five AS `String 5`,
    pscf.String_six AS `String 6`,
    pscf.String_seven AS `String 7`,
    pscf.String_eight AS `String 8`,
    productsinverters.product_name AS `Inverter`,
    '' AS `Tracker/String no.`,
    productsinverters.manufacturer AS `Inverter Manufacturer`,
    '' AS `Hybrid`,
    es.type_test_ref AS `Type Test No`,
    escf.Inverter_Rated_Output__W_ AS `Rated Output Power`,
    productsbattery.product_name AS Battery,
    productsroofkit.product_name AS `Mounting Kit`,
    escf.Tile_Type AS `Tile Type`,
    es.pitch AS `Roof Incline`,
    escf.Input_Variation_from_South AS `Variationo From South`,
    es.kk_figure AS `kWh/kWp`,
    pscf.IN___ABOVE_ROOF AS `IN / ABOVE ROOF`,
    escf.CARDINAL_DIRECTION AS `CARDINAL DIRECTION`,
    pscf.OVERSHADING_FACTOR AS `OVERSHADING FACTOR`,
    es.module_qty AS `NO# PANELS`,
    pscf.ARRAY_Mtwo AS `ARRAY M2`,
    es.kwp AS kWp,
    pscf.kWh AS kWh,
    pscf.COtwo_EQUIVALENT AS `CO2 EQUIVALENT`,
    ps.kwp AS `Net kWp`,
    pscf.Finished_Drawing AS `Finished Drawing`,
    pscf.Commissioning_Info_In AS `Commissioning Info In`,
    pscf.MCS_Completed AS `MCS Completed`,
    pscf.DNO_Document_Completed AS `DNO Document Completed`,
    pscf.HO_Pack_Completed AS `HO Pack Completed`,
    pscf.Shape AS Shape,
    pscf.MICROINV AS `Inverter Mauf`,
    pscf.Protective_Device AS `Protective Device`,
    escf.Building_Side AS `Building Side`,
    pscf.PARCEL AS Parcel,
    pscf.Block___House AS `Block/house`,
    pscf.Plot_Requirement AS `Plot requirement`,
    ie.import_date AS import_date,
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
    LEFT JOIN sn_import_events ie ON es.import_id = ie.import_id
    LEFT JOIN (
        SELECT
            entity_id,
            MAX(CASE WHEN field_name = 'Wattage' THEN field_value END) AS Wattage,
            MAX(CASE WHEN field_name = 'Voltage' THEN field_value END) AS Voltage,
            MAX(CASE WHEN field_name = 'MCS_Code' THEN field_value END) AS MCS_Code,
            MAX(CASE WHEN field_name = 'NO_Trackers' THEN field_value END) AS NO_Trackers,
            MAX(CASE WHEN field_name = 'String_one' THEN field_value END) AS String_one,
            MAX(CASE WHEN field_name = 'String_two' THEN field_value END) AS String_two,
            MAX(CASE WHEN field_name = 'String_three' THEN field_value END) AS String_three,
            MAX(CASE WHEN field_name = 'String_four' THEN field_value END) AS String_four,
            MAX(CASE WHEN field_name = 'String_five' THEN field_value END) AS String_five,
            MAX(CASE WHEN field_name = 'String_six' THEN field_value END) AS String_six,
            MAX(CASE WHEN field_name = 'String_seven' THEN field_value END) AS String_seven,
            MAX(CASE WHEN field_name = 'String_eight' THEN field_value END) AS String_eight,
            MAX(CASE WHEN field_name = 'IN___ABOVE_ROOF' THEN field_value END) AS IN___ABOVE_ROOF,
            MAX(CASE WHEN field_name = 'OVERSHADING_FACTOR' THEN field_value END) AS OVERSHADING_FACTOR,
            MAX(CASE WHEN field_name = 'ARRAY_Mtwo' THEN field_value END) AS ARRAY_Mtwo,
            MAX(CASE WHEN field_name = 'kWh' THEN field_value END) AS kWh,
            MAX(CASE WHEN field_name = 'COtwo_EQUIVALENT' THEN field_value END) AS COtwo_EQUIVALENT,
            MAX(CASE WHEN field_name = 'Finished_Drawing' THEN field_value END) AS Finished_Drawing,
            MAX(CASE WHEN field_name = 'Commissioning_Info_In' THEN field_value END) AS Commissioning_Info_In,
            MAX(CASE WHEN field_name = 'MCS_Completed' THEN field_value END) AS MCS_Completed,
            MAX(CASE WHEN field_name = 'DNO_Document_Completed' THEN field_value END) AS DNO_Document_Completed,
            MAX(CASE WHEN field_name = 'HO_Pack_Completed' THEN field_value END) AS HO_Pack_Completed,
            MAX(CASE WHEN field_name = 'Shape' THEN field_value END) AS Shape,
            MAX(CASE WHEN field_name = 'MICROINV' THEN field_value END) AS MICROINV,
            MAX(CASE WHEN field_name = 'Protective_Device' THEN field_value END) AS Protective_Device,
            MAX(CASE WHEN field_name = 'PARCEL' THEN field_value END) AS PARCEL,
            MAX(CASE WHEN field_name = 'Block___House' THEN field_value END) AS Block___House,
            MAX(CASE WHEN field_name = 'Plot_Requirement' THEN field_value END) AS Plot_Requirement
        FROM
            sn_custom_fields
        WHERE
            entity_id IN (SELECT plot_spec_id FROM sn_plot_spec)
        GROUP BY
            entity_id
    ) pscf ON pscf.entity_id = ps.plot_spec_id
    LEFT JOIN (
        SELECT
            entity_id,
            MAX(CASE WHEN field_name = 'elevationNumber' THEN field_value END) AS elevationNumber,
            MAX(CASE WHEN field_name = 'Elevation_No' THEN field_value END) AS Elevation_No,
            MAX(CASE WHEN field_name = 'Columns' THEN field_value END) AS Columns,
            MAX(CASE WHEN field_name = 'Rows' THEN field_value END) AS `Rows`,
            MAX(CASE WHEN field_name = 'Inverter_Rated_Output__W_' THEN field_value END) AS Inverter_Rated_Output__W_,
            MAX(CASE WHEN field_name = 'Tile_Type' THEN field_value END) AS Tile_Type,
            MAX(CASE WHEN field_name = 'Input_Variation_from_South' THEN field_value END) AS Input_Variation_from_South,
            MAX(CASE WHEN field_name = 'CARDINAL_DIRECTION' THEN field_value END) AS CARDINAL_DIRECTION,
            MAX(CASE WHEN field_name = 'Building_Side' THEN field_value END) AS Building_Side
        FROM
            sn_custom_fields
        WHERE
            entity_id IN (SELECT elevation_spec_id FROM sn_elevations_spec)
        GROUP BY
            entity_id
    ) escf ON escf.entity_id = es.elevation_spec_id
GROUP BY
    p.plot_id
ORDER BY
    p.plot_number,
    p.plot_id,
    escf.Elevation_No,
    escf.elevationNumber,
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
