/**
 * Runs the ingestOTron function with a specific folder.
 *
 * @param {string} folderId - The UUID of the Google Drive folder to be processed.
 *
 * @returns {void}
 *
 * @example
 * // Call the runner function with the UUID of a Google Drive folder
 * const folderUUID = "1234567890abcdefghijklmnopqrstuvwxyz";
 * runIngestOTron(folderUUID);
 */
function runIngestOTron() {
    let folderId = "117PqYtSoi6_dRi0HuLE1OvQlAt4bjVQf"
    console.log(ingestOTron(folderId));
}

function runIngestOTron2() {
    let folderId = "1wtkkJv1ll-HXWJMNjw_-RKbX2-dlPjy6"
    console.log(ingestOTron(folderId));
}

function runIngestOTron3() {
    let folderId = "1wtkkJv1ll-HXWJMNjw_-RKbX2-dlPjy6"
    console.log(ingestOTron(folderId));
}

/* import:
* plots
* projects
* products
* schedule
* devicemagic form return details
*/
function prepareImportObject(importSheetData){

    var sheetData = {
        plotData: {
            "plotId": "",
            "projectId": "",
            "plotNumber": importSheetData.MAP.PLOT_NO,
            "plotStatus": "Specified", // this really should be whether it's specified, signed off, or install or complete
            "siteId": "", // Needs to be derived from site import function, so no direct mapping
            "housetype": importSheetData.MAP.Housetype,
            "g99": "", // Assuming Gninenine indicates G99 compliance; adjust if necessary
            "mpan": importSheetData.Total_Costing.MPAN,
            "plotAddressId": "", // Needs to be derived from address import function, so no direct mapping
            "plotApproved": true,
            "commissioningFormSubmitted": "", // No direct mapping available; needs clarification
            "trackerRef": "",
            "legacyPlotID": importSheetData.MAP.PLOT_NO,
            addressData: {
                "address_line_1": importSheetData.Total_Costing.House_No_name,
                "address_line_2": importSheetData.Total_Costing.Street,
                "address_town": importSheetData.Total_Costing.Town,
                "address_county": "",
                "address_postcode": importSheetData.Total_Costing.Postcode,
                "address_country": "UK", // Assuming UK; adjust if necessary
            },
            plotSpecData: {
                "plotSpecId": "", // Needs a UUID or a unique identifier; no direct mapping
                "plotId": "",
                "dateSpecified": "", // No direct mapping available; needs clarification or default value
                "specifiedBy": "", // No direct mapping available; needs user ID of the specifier
                "plotSpecStatus": "Specified", // No direct mapping available; needs status determination
                "phase": importSheetData.MAP.Phase,
                "p1":"",
                "p2":"",
                "p3": "",
                "annualYield": "",
                "kwp": importSheetData.MAP.Net_kWp,
                "kwpWithLimitation": "",
                "limiterRequired": "",
                "limiterValueIfNotZero": "",
                "labourCost": "", // No direct mapping available; might need to derive o"r set manually
                "meter": "",
                "meterCost": "", // No direct mapping available; might need to derive or set manually
                "battery": importSheetData.Total_Costing.Battery, // No direct mapping available; adjust if necessary
                "batteryCost": importSheetData.Total_Costing.Battery_Sale, // No direct mapping available; might need to derive or set manually
                "overallCost": importSheetData.Total_Costing.Plot_Total_Inc_Battery,
                "landlordSupply": "",
                customFields: {
                    entityType: 'plotSpec',
                    fields: {
                        Wattage: importSheetData.MAP.Wattage,
                        Voltage: importSheetData.MAP.Voltage,
                        MCS_Code: importSheetData.MAP.MCS_Code,
                        Mids_Out: importSheetData.MAP.Mids_Out,
                        MID_Gaps: importSheetData.MAP.MID_Gaps,
                        Panels_off_end: importSheetData.MAP.Panels_off_end,
                        Shape: importSheetData.MAP.Shape,
                        NO_Trackers: importSheetData.MAP.NO_Trackers,
                        String_one: importSheetData.MAP.String_one,
                        String_two: importSheetData.MAP.String_two,
                        String_three: importSheetData.MAP.String_three,
                        String_four: importSheetData.MAP.String_four,
                        String_five: importSheetData.MAP.String_five,
                        String_six: importSheetData.MAP.String_six,
                        String_seven: importSheetData.MAP.String_seven,
                        String_eight: importSheetData.MAP.String_eight,
                        IN___ABOVE_ROOF: importSheetData.MAP.IN___ABOVE_ROOF,
                        OVERSHADING_FACTOR: importSheetData.MAP.OVERSHADING_FACTOR,
                        ARRAY_Mtwo: importSheetData.MAP.ARRAY_Mtwo,
                        kWh: importSheetData.MAP.kWh,
                        COtwo_EQUIVALENT: importSheetData.MAP.COtwo_EQUIVALENT,
                        Net_kWp: importSheetData.MAP.Net_kWp,
                        FF_Material: importSheetData.MAP.FF_Material,
                        PARCEL: importSheetData.MAP.PARCEL,
                        Roof_Incline: importSheetData.Total_Costing.Roof_Incline,
                        Plot_Requirement: importSheetData.Total_Costing.Plot_Requirement,
                        Block___House: importSheetData.Total_Costing.Block___House,
                        PV_Diverter: importSheetData.Total_Costing.PV_Diverter,
                        Protective_Device: importSheetData.Total_Costing.Protective_Device,
                        Finished_Drawing: importSheetData.Total_Costing.Finished_Drawing,
                        Commissioning_Info_In: importSheetData.Total_Costing.Commissioning_Info_In,
                        MCS_Completed: importSheetData.Total_Costing.MCS_Completed,
                        DNO_Document_Completed: importSheetData.Total_Costing.DNO_Document_Completed,
                        HO_Pack_Completed: importSheetData.Total_Costing.HO_Pack_Completed,
                        Solar_PV_Kit: importSheetData.Total_Costing.Solar_PV_Kit,
                        PVD_Material: importSheetData.Total_Costing.PVD_Material,
                        PVD_Labour: importSheetData.Total_Costing.PVD_Labour,
                        Electrical_Kit: importSheetData.Total_Costing.Electrical_Kit,
                        FF_Labour: importSheetData.Total_Costing.FF_Labour,
                        SF_Material: importSheetData.Total_Costing.SF_Material,
                        SF_Labour: importSheetData.Total_Costing.SF_Labour,
                        Solar_Total_Prime: importSheetData.Total_Costing.Solar_Total_Prime,
                        FF_MU_: importSheetData.Total_Costing.FF_MU_,
                        Total_Margin: importSheetData.Total_Costing.Total_Margin,
                        Solar_PV_Kit___Roofing: importSheetData.Total_Costing.Solar_PV_Kit___Roofing,
                        FF_Material___Sale: importSheetData.Total_Costing.FF_Material___Sale,
                        FF_Labour___Sale: importSheetData.Total_Costing.FF_Labour___Sale,
                        DV_MU_: importSheetData.Total_Costing.DV_MU_,
                        PVD_Sale: importSheetData.Total_Costing.PVD_Sale,
                        PVD_Material_Sale: importSheetData.Total_Costing.PVD_Material_Sale,
                        PVD_Labour_Sale: importSheetData.Total_Costing.PVD_Labour_Sale,
                        SF_MU_: importSheetData.Total_Costing.SF_MU_,
                        Electrical_Kit___Commissioning: importSheetData.Total_Costing.Electrical_Kit___Commissioning,
                        SF_Material__Sale_: importSheetData.Total_Costing.SF_Material__Sale_,
                        SF_Labour__Sale_: importSheetData.Total_Costing.SF_Labour__Sale_,
                        Plot_Total__Sale_: importSheetData.Total_Costing.Plot_Total__Sale_,
                        Profit__Sale_: importSheetData.Total_Costing.Profit__Sale_,
                        BATTERY_MU_: importSheetData.Total_Costing.BATTERY_MU_,
                        Total_Battery_Margin: importSheetData.Total_Costing.Total_Battery_Margin,
                        Battery_Sale: importSheetData.Total_Costing.Battery_Sale,
                        Profit_Battery__SALE_: importSheetData.Total_Costing.Profit_Battery__SALE_,
                        Margin_At_time_of_Quotation: importSheetData.Total_Costing.Margin_At_time_of_Quotation,
                        Solar_PV_Kit__Quoted_: importSheetData.Total_Costing.Solar_PV_Kit__Quoted_,
                        FF_Material__Quoted_: importSheetData.Total_Costing.FF_Material__Quoted_,
                        FF_Labour__Quoted_: importSheetData.Total_Costing.FF_Labour__Quoted_,
                        Electrical_Kit__Quoted_: importSheetData.Total_Costing.Electrical_Kit__Quoted_,
                        PVD_SALE__Quoted_: importSheetData.Total_Costing.PVD_SALE__Quoted_,
                        PVD_Material__Quoted_: importSheetData.Total_Costing.PVD_Material__Quoted_,
                        PVD_Labour__Quoted_: importSheetData.Total_Costing.PVD_Labour__Quoted_,
                        SF_Material__Quoted_: importSheetData.Total_Costing.SF_Material__Quoted_,
                        SF_Labour__Quoted_: importSheetData.Total_Costing.SF_Labour__Quoted_,
                        Plot_Total__Quoted_: importSheetData.Total_Costing.Plot_Total__Quoted_,
                        Profit_When_Quoted: importSheetData.Total_Costing.Profit_When_Quoted,
                        Todays_Profit__Quoted_: importSheetData.Total_Costing.Todays_Profit__Quoted_,
                        Total_Battery_margin__Quoted_: importSheetData.Total_Costing.Total_Battery_margin__Quoted_,
                        Battery__Quoted_: importSheetData.Total_Costing.Battery__Quoted_,
                        Plot_Total_With_Battery__Quoted_: importSheetData.Total_Costing.Plot_Total_With_Battery__Quoted_,
                        Battery_Profit__When_Quoted: importSheetData.Total_Costing.Battery_Profit__When_Quoted,
                        Todays_Profit_With_Battery__Quoted_: importSheetData.Total_Costing.Todays_Profit_With_Battery__Quoted_,
                        MICROINV: importSheetData.Total_Costing.MICROINV,
                        SOLIS_SP__CALC_: importSheetData.Total_Costing.SOLIS_SP__CALC_,
                        SOLIS_threeP__CALC_: importSheetData.Total_Costing.SOLIS_threeP__CALC_,
                        HUAWEI_HY__CALC_: importSheetData.Total_Costing.HUAWEI_HY__CALC_,
                        GROWATT_SP: importSheetData.Total_Costing.GROWATT_SP,
                        GIVENERGY: importSheetData.Total_Costing.GIVENERGY
                    }
                }
            },
            plotInstallData: {
                "plotInstallId": "", // Needs a UUID or a unique identifier; no direct mapping
                "plotId": "",
                "dateInstall": "",
                "dateChecked": "",
                "installBy": "", // No direct mapping available; needs user ID of the installer
                "checkedBy": "", // No direct mapping available; needs user ID of the checker
                "plotInstallStatus": "", // this should be if it's first fix, second fix, complete, remedial, or other.
                "phase": "",
                "p1": "",
                "p2": "",
                "p3": "",
                "annualYield": "",
                "kwp": "",
                "kwpWithLimitation": "",
                "limiterRequired": "",
                "limiterValueIfNotZero": "",
                "labourCost": "", // No direct mapping available; might need to derive or set manually
                "meter": "",
                "meterCost": "", // No direct mapping available; might need to derive or set manually
                "battery": "", // No direct mapping available; adjust if necessary
                "batteryCost": "", // No direct mapping available; might need to derive or set manually
                "overallCost": "",
                "mcsSubmissionId": "" // No direct mapping available; might use "MCS_Completed" or another field
            },
            siteData: {
                "siteName": importSheetData.Site_Data.Site_name,
                "addressData": {
                    "address_line_1": importSheetData.Site_Data.Site_address,
                    "address_line_2": "",
                    "address_town": importSheetData.Total_Costing.Town,
                    "address_county": "",
                    "address_postcode": importSheetData.Site_Data.Site_post_code,
                    "address_country": "UK", // Assuming UK; adjust if necessary
                    "address_region_id": "",
                    "address_region_number": ""
                },
                siteManagerData: {
                    "sso_id": "", // not defined
                    "name": "",
                    "email": "",
                    "phone": "",
                    "employer": "",
                    "team": "", // No direct mapping available; needs clarification
                    "dispatch_id": "", // unlikely to be used
                    "snowy_role": "", // they're a site manager
                    "company_role": "",
                    "category": ""
                },
                surveyorData: {
                    "sso_id": "", // not defined
                    "name": importSheetData.Site_Data.Surveyor,
                    "email": importSheetData.Site_Data.Surveyor_email,
                    "phone": importSheetData.Site_Data.Surveyor_phone,
                    "employer": "",
                    "team": "", // No direct mapping available; needs clarification
                    "dispatch_id": "", // unlikely to be used
                    "snowy_role": "Surveyor", // they're a site manager
                    "company_role": "Surveyor",
                    "category": "Human"
                },
                agentData: {
                    "sso_id": "", // not defined
                    "name": importSheetData.Site_Data.SiteAgent,
                    "email": importSheetData.Site_Data.SiteAgent_email,
                    "phone": importSheetData.Site_Data.SiteAgent_phone,
                    "employer": "",
                    "team": "", // No direct mapping available; needs clarification
                    "dispatch_id": "", // unlikely to be used
                    "snowy_role": "Site Agent", // they're a site manager
                    "company_role": "Site Agent",
                    "category": "Human"
                },
                //
                "mpanId": "",
                "pvNumber": importSheetData.Site_Data.Job_code,
                customFields: {
                    entityType: "site",
                    fields: {
                    }
                }
            },
            elevationData: { //shouldn't be specified as not installed yet
                "plot_install_id": "", // Needs to be derived from plot installation details, so no direct mapping
                "plot_id": "",
                "type_test_ref": "",
                "pitch": "",
                "orientation": "",
                "kk_figure": "",
                "kwp": "",
                "strings": "",
                "module_qty": "",
                "inverter": "",
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "panel": "",
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": "",
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": "",
                customFields: {
                    entityType: 'elevationInstall',
                    fields: {
                        elevationNumber: ""
                    }
                }
            },
            elevationSpecData: {
                "plot_spec_id": "", // Needs a UUID or a unique identifier; no direct mapping
                "plot_id": "",
                "type_test_ref": importSheetData.Total_Costing.Model_Number,
                "pitch": importSheetData.MAP.Roof_Incline,
                "orientation": importSheetData.MAP.Orientation,
                "kk_figure": importSheetData.MAP.kWh_kWp,
                "kwp": importSheetData.MAP.kWp,
                "strings": importSheetData.MAP.Total_Strings,
                "module_qty": importSheetData.MAP.NO__PANELS,
                "inverter": importSheetData.Total_Costing.Inverter,
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "inverter_manufacturer": importSheetData.Total_Costing.Inverter_Manufacturer,
                "panel": importSheetData.MAP.Panel,
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": importSheetData.MAP.Mounting,
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": "",
                customFields: {
                    entityType: 'elevationSpec',
                    fields: {
                        Inverter_Model_Number: importSheetData.Total_Costing.Model_Number,
                        Inverter_Rated_Output__W_: importSheetData.Total_Costing.Rated_Output__W_,
                        Columns: importSheetData.MAP.Columns,
                        Rows: importSheetData.MAP.Rows,
                        Mounting: importSheetData.MAP.Mounting,
                        Tile_Type: importSheetData.MAP.Tile_Type,
                        Elevation_No: importSheetData.MAP.Elevation_No,
                        elevationNumber: "",
                        Building_Side: importSheetData.MAP.Building_Side,
                        Input_Roof_Incline: importSheetData.MAP.Input_Roof_Incline,
                        Input_Variation_from_South: importSheetData.MAP.Input_Variation_from_South,
                        Inverter_Manufacturer: importSheetData.Total_Costing.Inverter_Manufacturer,
                        CARDINAL_DIRECTION: importSheetData.MAP.CARDINAL_DIRECTION
                    }
                }
            },
            projectData: {
                "pvNumber": importSheetData.Site_Data.Job_code,
                clientData: {
                    "email": "", // No direct mapping in importSheetData, may need to derive or set manually
                    "name": importSheetData.Site_Data.Client,
                    addressData: {
                        "address_line_1": "",
                        "address_line_2": "",
                        "address_town": "",
                        "address_county": "",
                        "address_postcode": "",
                        "address_country": "", // Assuming UK; adjust if necessary
                    },
                    userData: {
                        "sso_id": "", // not defined
                        "name": "",
                        "email": "",
                        "phone": "",
                        "employer": importSheetData['Site_Data'].Client,
                        "team": "", // No direct mapping available; needs clarification
                        "dispatch_id": "", // unlikely to be used
                        "snowy_role": "Client Contact", // they're a site manager
                        "company_role": "Client Contact",
                        "category": "Humans"
                    },
                    customFields: {
                        entityType: "project",
                        fields: {
                            Total_systems: importSheetData.Site_Data.Total_systems,
                            Total_Panels: importSheetData.Site_Data.Total_Panels,
                            Site_kWp: importSheetData.Site_Data.Site_kWp,
                            Site_cotwo: importSheetData.Site_Data.Site_cotwo
                        }
                    }
                },
                dnoDetails: {
                    "mpanId": "",
                    "dnoName": "",
                    "refNumber": "",
                    "dnoZone": ""
                },
                projectProcessData: {
                    "project_process_id": "", // Needs a UUID or a unique identifier; no direct mapping
                    "approval_status": "",
                    "deadline_to_connect": "", // Assuming this field matches; may need conversion to Date
                    "auth_letter_sent": "",
                    "mpan_request_sent": "",
                    "schematic_created": "",
                    "application_type": "",
                    "formal_dno_submitted": "",
                    "submission_date": "", // May need conversion to Date
                    "dno_due_date": "", // May need conversion to Date
                    "dno_status": "",
                    "approved_kwp": "", // Assuming the field contains "kW" and needs parsing as float
                    "quote_received": "", // Assuming "N/A" means no quote received
                    "customer_invoiced_date": "", // Assuming "N/A" means not invoiced
                    "dno_payment_made": "", // Assuming "N/A" means payment not made
                    "acceptance_form_returned": "", // Assuming an empty string means the form has not been returned
                    "date_approved": "" // May need conversion to Date
                },
                "additionalDetails": {
                    "refNumber": "",
                    "projectName": importSheetData.Site_Data.Site_name,
                    "jobCode": importSheetData.Site_Data.Job_code,
                    "comments": "",
                    "dnoZone": ""
                }
            }
        }
    }

    return sheetData;
}





const queryConfigByIndex = {
    sheetId: "1_WBNoPSzhuos5zd6-B555iyZVG25aVRE440HZEu6czI",
    sheets: {
        MAP: {
            joinOn: "PLOT NO",
            searchIndex: 0
        },
        "Total Costing": {
            joinOn: "PLOT NO"
        },
        "Site Data": {
        }
    }
};

const clientObject = {
    instanceNameKey: "upowa", // A unique identifier or key for the instance, used to prevent duplicate entries.
    instanceName: "Upowa", // The human-readable name of the instance.
    instanceDescription: "Upowa installs Solar PV", // A brief description of the instance or client.
    userObject: { // Details about the initial admin user for this instance.
        name: "Tim Dobson", // Full name of the user.
        email: "tim@migratingdragons.com", // Email address of the user, used to check for existing users.
        employer: "Migrating Dragons", // Name of the user's employer, which in this case is the same as the instance name.
        companyRole: "CEO", // The user's role within their company.
        snowyRole: "Administrator" // The user's role within the Snowy application.
    }
};



/**
 * Imports plot data from a spreadsheet into a database.
 *
 * This function performs the following steps:
 * 1. Establishes a database connection using the provided credentials.
 * 2. Creates an import event in the database.
 * 3. Enters a loop to retrieve row data from the "Total Costing" sheet based on the index specified in the "MAP" sheet.
 *    - If the row data matches, it prepares an import object and imports the plot data into the database using the `importPlotData` function.
 *    - If there are 20 consecutive "false" returns from `querySheetsByIndexWithSpecialSheet`, the loop breaks and the function returns `true` to indicate that the file is completed.
 *    - The `searchIndex` in the "MAP" sheet is incremented after each iteration.
 * 4. The loop continues until 20 minutes have elapsed since the start time or 20 consecutive "false" returns occur.
 * 5. Before the loop terminates, it stores the current `searchIndex` in a persistent script variable associated with the `queryConfigByIndex.sheetId`.
 *
 * If a persistent script variable exists for the current `queryConfigByIndex.sheetId`, the function
 * sets the `queryConfigByIndex.sheets.MAP.searchIndex` to the value of the persistent script variable
 * before starting the loop.
 *
 * @function
 * @param {Object} queryConfigByIndex - The configuration object for querying sheets.
 * @returns {boolean} Returns `true` if the file is completed, `false` otherwise.
 */
function importMapSheet(queryConfigByIndex) {
    const usePersistentScriptVariable = false; // Set to true to use the persistent script variable

    const conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    const details = insertInstanceAndGetUuid(conn, clientObject);
    const importId = insertImportEvent(conn, details.instanceId, '', 'Site Log Import', 'Test Import', details.adminUserId);

    // Check if a persistent script variable exists for the current queryConfigByIndex.sheetId
    const persistentScriptVariableName = `searchIndex_${queryConfigByIndex.sheetId}`;
    const scriptProperties = PropertiesService.getScriptProperties();
    const persistentScriptVariable = scriptProperties.getProperty(persistentScriptVariableName);

    if (usePersistentScriptVariable && persistentScriptVariable) {
        queryConfigByIndex.sheets.MAP.searchIndex = parseInt(persistentScriptVariable, 10);
    }

    const startTime = new Date().getTime();
    let consecutiveFalseCount = 0;

    while (true) {
        const rowObject = querySheetsByIndexWithSpecialSheet(queryConfigByIndex);
        console.log(rowObject);

        if (rowObject.matched) {
            const importObject = prepareImportObject(rowObject);
            const result = importPlotData(conn, details.instanceId, importId, importObject.plotData);
            console.log("plot ID", result);
            consecutiveFalseCount = 0;
        } else {
            console.log("No matching data found in the 'Total Costing' sheet for the specified row index in the 'MAP' sheet.");
            consecutiveFalseCount++;

            if (consecutiveFalseCount === 50) {
                console.log("File is completed. Breaking the loop after 50 consecutive false returns.");
                return true; // File is completed
            }
        }

        queryConfigByIndex.sheets.MAP.searchIndex++;

        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= 20 * 60 * 1000) { // 20 minutes in milliseconds
            // Store the current searchIndex in a persistent script variable
            scriptProperties.setProperty(persistentScriptVariableName, queryConfigByIndex.sheets.MAP.searchIndex.toString());
            return false; // File is not completed, time limit reached
        }
    }
}
/**
 * Processes Google Sheets in a Google Drive folder, runs the importMapSheet() function on each sheet,
 * and moves the processed sheets to a "Completed" folder within the same parent folder.
 *
 * @param {string} parentFolderId - The UUID of the Google Drive folder containing the Google Sheets to be processed.
 *
 * @description
 * The ingestOTron function performs the following steps:
 * 1. Retrieves the parent folder using the provided `parentFolderId`.
 * 2. Checks if a "Completed" folder exists within the parent folder. If not, it creates one.
 * 3. Starts a 20-minute timer to limit the overall processing time.
 * 4. Retrieves all the Google Sheets in the parent folder (excluding the "Completed" folder) that the script owns.
 * 5. Iterates over each Google Sheet in the folder:
 *    - Checks if the 20-minute timer has expired. If so, it stops processing further sheets.
 *    - Generates a unique lock key for the current sheet using its ID.
 *    - Attempts to acquire a file-level lock using the `acquireFileLock` utility function.
 *    - If the lock is acquired, updates the `sheetId` property in the `queryConfigByIndex` object with the current sheet's ID.
 *    - Runs the `importMapSheet()` function on the current sheet with the updated `queryConfig`.
 *    - If the sheet is marked as completed by `importMapSheet()`, moves the sheet to the "Completed" folder.
 *    - Releases the file-level lock using the `releaseFileLock` utility function.
 *    - If the lock could not be acquired, moves on to the next file.
 * 6. If an error occurs during the processing of a sheet, logs the error and releases the file-level lock if it was acquired.
 *
 * @returns {void}
 *
 * @example
 * // Call the ingestOTron function with the UUID of a Google Drive folder
 * const folderUUID = "1234567890abcdefghijklmnopqrstuvwxyz";
 * ingestOTron(folderUUID);
 *
 * @example
 * // Call the ingestOTron function with a folder object
 * const folder = DriveApp.getFolderById("1234567890abcdefghijklmnopqrstuvwxyz");
 * ingestOTron(folder.getId());
 *
 * @see {@link importMapSheet} for the main processing function called on each Google Sheet.
 * @see {@link acquireFileLock} for the utility function to acquire a file-level lock.
 * @see {@link releaseFileLock} for the utility function to release a file-level lock.
 * @see {@link getOrCreateFolder} for the utility function to retrieve or create the "Completed" folder.
 */
function ingestOTron(parentFolderId) {
    // Get the parent folder
    const parentFolder = DriveApp.getFolderById(parentFolderId);
    console.log(`Processing folder: ${parentFolder.getName()}`);

    // Check if the "Completed" folder exists, create it if not
    let completedFolder = getOrCreateFolder(parentFolder, "Completed");

    // Start the 20-minute timer
    const startTime = new Date().getTime();

    // Get all Google Sheets in the parent folder (excluding the "Completed" folder) that the script owns
    const sheets = parentFolder.getFilesByType(MimeType.GOOGLE_SHEETS);

    while (sheets.hasNext()) {
        const sheet = sheets.next();
        console.log(`Processing file: ${sheet.getName()}`);

        // Check if the script owns the sheet
        if (sheet.getOwner().getEmail() === Session.getEffectiveUser().getEmail()) {
            // Check if the 20-minute timer has expired
            if (new Date().getTime() - startTime >= 20 * 60 * 1000) {
                console.log("20-minute time limit reached. Stopping sheet processing.");
                break;
            }

            const fileId = sheet.getId();
            const lockKey = `lock_${fileId}`;

            try {
                if (acquireFileLock(lockKey)) {
                    console.log(`Lock acquired for file: ${sheet.getName()}`);

                    // Update the sheetId in the queryConfigByIndex object with the current sheet ID
                    const queryConfig = {
                        ...queryConfigByIndex,
                        sheetId: sheet.getId(),
                    };

                    // Run the importMapSheet() function on the current sheet with the updated queryConfig
                    const isSheetCompleted = importMapSheet(queryConfig);

                    // Move the processed sheet to the "Completed" folder only if it is completed
                    if (isSheetCompleted) {
                        sheet.moveTo(completedFolder);
                        console.log(`File moved to "Completed" folder: ${sheet.getName()}`);
                    }

                    // Release the file-level lock
                    releaseFileLock(lockKey);
                    console.log(`Lock released for file: ${sheet.getName()}`);
                } else {
                    console.log(`Lock could not be acquired for file: ${sheet.getName()}. Moving to the next file.`);
                }
            } catch (error) {
                console.error(`Error processing sheet '${sheet.getName()}':`, error);
                // Release the file-level lock in case of an error
                releaseFileLock(lockKey);
            }
        } else {
            console.log(`Skipping file not owned by the script: ${sheet.getName()}`);
        }
    }
}
