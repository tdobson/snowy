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
            "plotNumber": importSheetData.Bookings.Plot_Number,
            "plotStatus": "Specified", // this really should be whether it's specified, signed off, or install or complete
            "siteId": "", // Needs to be derived from site import function, so no direct mapping
            "housetype": "", //not found apparently
            "g99": "", // Assuming Gninenine indicates G99 compliance; adjust if necessary
            "mpan": "",
            "plotAddressId": "", // Needs to be derived from address import function, so no direct mapping
            "plotApproved": "",
            "commissioningFormSubmitted": "", // No direct mapping available; needs clarification
            "trackerRef": "",
            "legacyPlotID": "",
            addressData: {
                "address_line_1": importSheetData.Bookings.Address,
                "address_line_2": "",
                "address_town": "",
                "address_county": "",
                "address_postcode": "",
                "address_country": "UK", // Assuming UK; adjust if necessary
            },
            plotSpecData: {
                "plotSpecId": "", // Needs a UUID or a unique identifier; no direct mapping
                "plotId": "",
                "dateSpecified": "", // No direct mapping available; needs clarification or default value
                "specifiedBy": "", // No direct mapping available; needs user ID of the specifier
                "plotSpecStatus": "Specified", // No direct mapping available; needs status determination
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
                "landlordSupply": ""
            },
            plotInstallData: {
                "plotInstallId": "", // Needs a UUID or a unique identifier; no direct mapping
                "plotId": "",
                "dateInstall": importSheetData.Jobs.onest_fix_complete,
                "dateChecked": importSheetData.Jobs.twond_fix_complete,
                "installBy": "", // No direct mapping available; needs user ID of the installer
                "checkedBy": "", // No direct mapping available; needs user ID of the checker
                "plotInstallStatus": "", // this should be if it's first fix, first fix part complete, second fix, second fix part complete, complete, remedial, or other.
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
                "siteName": "",
                "addressData": {
                    "address_line_1": "",
                    "address_line_2": "",
                    "address_town": "",
                    "address_county": "",
                    "address_postcode": "",
                    "address_country": "UK", // Assuming UK; adjust if necessary
                    "address_region_id": "",
                    "address_region_number": ""
                },
                userData: {
                    "sso_id": "", // not defined
                    "name": "",
                    "email": "",
                    "phone": "",
                    "employer": "",
                    "team": "", // No direct mapping available; needs clarification
                    "dispatch_id": "", // unlikely to be used
                    "snowy_role": "Site Manager", // they're a site manager
                    "company_role": "Site Manager",
                    "category": "Humans"
                },
                "mpanId": "",
                "pvNumber": importSheetData.Bookings.Project_Number
            },
            elevationData: {
                "plot_install_id": "", // Needs to be derived from plot installation details, so no direct mapping
                "plot_id": "",
                "type_test_ref": "",
                "pitch": "",
                "orientation": "",
                "kk_figure": "",
                "kwp": "",
                "strings": "",
                "module_qty": "",
                "inverter": importSheetData.Bookings.Inverter,
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "panel": importSheetData.Bookings.Panel,
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": importSheetData.Bookings.Roof_Kit,
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": ""
            },
            elevationSpecData: {
                "plot_spec_id": "", // Needs a UUID or a unique identifier; no direct mapping
                "plot_id": "",
                "type_test_ref": "",
                "pitch": "",
                "orientation": "",
                "kk_figure": "",
                "kwp": "",
                "strings": "",
                "module_qty": "",
                "inverter": importSheetData.Bookings.Inverter,
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "panel": importSheetData.Bookings.Panel,
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": importSheetData.Bookings.Roof_Kit,
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": ""
            },
            projectData: {
                "pvNumber": importSheetData.Bookings.Project_Number,
                clientData: {
                    "email": "", // No direct mapping in importSheetData, may need to derive or set manually
                    "name": "",
                    addressData: {
                        "address_line_1": "",
                        "address_line_2": "",
                        "address_town": "",
                        "address_county": "",
                        "address_postcode": "",
                        "address_country": "UK", // Assuming UK; adjust if necessary
                    },
                    userData: {
                        "sso_id": "",
                        "name": "",
                        "email": "",
                        "phone": "",
                        "employer": "",
                        "team": "",
                        "dispatch_id": "",
                        "snowy_role": "",
                        "company_role": "",
                        "category": ""
                    },
                },
                dnoDetails: {
                    "mpanId": "",
                    "dnoName": "",
                    "refNumber": "",
                    "dnoZone": ""
                },
                projectProcessData: {
                    "project_process_id": "",
                    "approval_status": "",
                    "deadline_to_connect": "",
                    "auth_letter_sent": "",
                    "mpan_request_sent": "",
                    "schematic_created": "",
                    "application_type": "",
                    "formal_dno_submitted": "",
                    "submission_date": "",
                    "dno_due_date": "",
                    "dno_status": "",
                    "approved_kwp": "",
                    "quote_received": "",
                    "customer_invoiced_date": "",
                    "dno_payment_made": "",
                    "acceptance_form_returned": "",
                    "date_approved": ""
                },
                "additionalDetails": {
                    "refNumber": "",
                    "projectName": "",
                    "jobCode": "",
                    "comments": "",
                    "dnoZone": ""
                }
            }
        }
    }

    return sheetData;
}





const obsTrackerSheetId = "13LhHn2I3xqvtI4F_vTLxw-MbMgYnr_SdLURo0A7uOKw";
const obsQueryConfigByIndex = {
    sheetId: obsTrackerSheetId,
    sheets: {
        Bookings: {
            joinOn: "Project Number",
            searchIndex: 2
        },
        Jobs: {
            joinOn: "Project Number"
        },
        "Completed Work": {
            joinOn: "Project Number"
        }
    }
};


// This script will try to import everything possible from the obs tracker
function main() {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var importId = insertImportEvent(conn, '', 'Site Log Import', 'Test Import', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

    // Import Control sheet data
    importObsControl(conn, '', importId);

    let rowObject = querySheetsByIndex(obsQueryConfigByIndex) //15-20seconds

    let importObject = prepareImportObject(rowObject)

    // Logger.log(JSON.stringify(importObject))
    let result = importPlotData(conn, importId, importObject.plotData)
    console.log(result)
}



function testFunction() {


    Logger.log(JSON.stringify(rowObject))
}
