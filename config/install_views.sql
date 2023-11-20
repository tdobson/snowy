-- This view, sn_projects_info, provides a consolidated view of the total specified and installed kilowatt-peak values for each project.
CREATE VIEW sn_projects_info AS
SELECT
    p.project_id,
    SUM(ps.kwp) AS kwp_from_oscar, -- Sum of 'kwp' from 'sn_plot_specified' for each project.
    SUM(pi.kwp) AS current_total_kwp, -- Sum of 'kwp' from 'sn_plot_installed' for each project.
    SUM(pi.kwp_with_limitation) AS total_kwp_with_limitation -- Sum of 'kwp_with_limitation' from 'sn_plot_installed' for each project.
    p.approved_kwp, -- Approved kwp from the DNO
FROM
    sn_projects p
LEFT JOIN
    sn_plots plt ON p.project_id = plt.project_id
LEFT JOIN
    sn_plot_specified ps ON plt.plot_id = ps.plot_meta_id
LEFT JOIN
    sn_plot_install pi ON plt.plot_id = pi.plot_meta_id
GROUP BY
    p.project_id;


    -- this view provides the info requires to submit to the MCS api
    CREATE VIEW sn_mcs_submission_details AS
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
