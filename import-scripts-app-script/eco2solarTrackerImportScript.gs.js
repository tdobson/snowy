

/* import:
* plots
* projects
* products
* schedule
* devicemagic form return details
*/

var testImportSheetData2 = {"plotData":{"plotId":"","projectId":"","plotNumber":"84","plotStatus":"","siteId":"","housetype":"","g99":"","mpan":"","plotAddressId":"","plotApproved":false,"commissioningFormSubmitted":"","trackerRef":124,"legacyPlotID":4710,"plotSpecData":{"plotSpecId":"","plotId":"","dateSpecified":"","specifiedBy":"","plotSpecStatus":"Specified","phase":"Single Phase","p1":0.7,"p2":0,"p3":0,"annualYield":648.81,"kwp":0.7,"kwpWithLimitation":0.7,"limiterRequired":false,"limiterValueIfNotZero":"","labourCost":"","meter":"","meterCost":"","battery":"","batteryCost":"","overallCost":1099,"landlordSupply":false},"plotInstallData":{"plotInstallId":"","plotId":"","dateInstall":"","dateChecked":"","installBy":"","checkedBy":"","plotInstallStatus":"","phase":"Single Phase","p1":0.7,"p2":0,"p3":0,"annualYield":648.81,"kwp":0.7,"kwpWithLimitation":0.7,"limiterRequired":false,"limiterValueIfNotZero":"","labourCost":"","meter":"","meterCost":"","battery":"","batteryCost":"","overallCost":1099,"mcsSubmissionId":""},"siteData":{"siteName":"St Andrews Park,Lutterworth Road, Franklyn Fields","addressData":{"address_line_1":"Gate 4, Rugby Radio Station","address_line_2":"Houlton","address_town":"Rugby","address_county":"Warwickshire","address_postcode":"CV23 0AB","address_country":"UK","address_region_id":"","address_region_number":3},"userData":{"sso_id":"","name":"","email":"Stephen.Newell@lovell.co.uk","phone":"","employer":"Lovell Partnerships west Midlands","team":"","dispatch_id":"","snowy_role":"Site Manager","company_role":"Site Manager","category":"Humans"},"mpanId":"","pvNumber":"02501PV"},"elevationData":{"plot_install_id":"","plot_id":"","type_test_ref":"SOLIS/03638/V1","pitch":34,"orientation":75,"kk_figure":999,"kwp":0.7,"strings":1,"module_qty":3,"inverter":"Solis-mini-700-S5","inverter_cost":"","panel":"270w Viridian Poly Black","panel_cost":"","panels_total_cost":"","roof_kit":"GSE-test-item","roof_kit_cost":"","annual_yield":648.81},"elevationSpecData":{"plot_spec_id":"","plot_id":"","type_test_ref":"SOLIS/03638/V1","pitch":34,"orientation":75,"kk_figure":999,"kwp":0.7,"strings":1,"module_qty":3,"inverter":"Solis-mini-700-S5","inverter_cost":"","panel":"270w Viridian Poly Black","panel_cost":"","panels_total_cost":"","roof_kit":"GSE-test-item","roof_kit_cost":"","annual_yield":648.81},"projectData":{"pvNumber":"06798PV","clientData":{"email":"","name":"Lovell Partnerships west Midlands","addressData":{"address_line_1":"Lovell Partnerships west Midlands","address_line_2":"Building 7","address_town":"Quinton Business Park","address_county":"Birmingham","address_postcode":"B32 1AF","address_country":"UK"}},"dnoDetails":{"mpanId":"","dnoName":"GTC","refNumber":24,"dnoZone":6},"projectProcessData":{"project_process_id":"","approval_status":"6-Full Approval","deadline_to_connect":"","auth_letter_sent":true,"mpan_request_sent":true,"schematic_created":true,"application_type":"G98","formal_dno_submitted":true,"submission_date":"2022-05-10T23:00:00.000Z","dno_due_date":"2022-07-10T23:00:00.000Z","dno_status":"6-Full Approval","approved_kwp":281,"quote_received":true,"customer_invoiced_date":null,"dno_payment_made":null,"acceptance_form_returned":true,"date_approved":"2022-06-29T23:00:00.000Z"},"additionalDetails":{"refNumber":"N0016614-1","projectName":"Rugby Radio Station (Lovell)","jobCode":"06798PV","comments":"","dnoZone":6}}}}


var testImportSheetData = {
    "Plots": {
        "Plot_ID": 4709,
        "Tracker_Ref": 124,
        "Project_Number": "02501PV",
        "Plot_Number": "83",
        "Site": "St Andrews Park,Lutterworth Road, Franklyn Fields",
        "Client": "Morris Homes Midlands",
        "Region": "",
        "Gninenine": "",
        "Mpan": "",
        "Postal_Name___Number": "",
        "Postal_Street": "",
        "POSTAL_POSTCODE": "",
        "KWP": 0.7,
        "MODULE_SIZE": 0.27,
        "MODULE_QTY": 2,
        "INVERTER": "Solis-mini-700-S5",
        "PANEL_SPECIFIED": "270w Viridian Poly Black",
        "Strings": 1,
        "Phase": "Single Phase",
        "Pone": 0.7,
        "Ptwo": 0,
        "Pthree": 0,
        "DUAL_ELEVATION": "",
        "STATUS": "",
        "TYPE_TEST_Ref": "SOLIS/03638/V1",
        "Project_Plot": "02501PV-83",
        "Site_Ref": 2501,
        "Pitch": 30,
        "Orientation": 95,
        "DNO_Zone": 6,
        "Annual_Yield": 401.76,
        "kWp_with_limitation": 0.7,
        "Limiter_Required": false,
        "Limiter_Value_If_not_Zero": "",
        "Plot_Approved": false,
        "Landlord_Supply": false,
        "onest_fix_completion_date": "",
        "onest_fix_Installed_Roof_Kit": "",
        "onest_fix_Installed_Panel": "",
        "onest_fix_Installed_Total_Panels": "",
        "twond_fix_completion_date": "",
        "twond_fix_Installed_Panel": "",
        "twond_fix_Installed_Capacity": "",
        "twond_fix_Installed_Inverter": "",
        "RoofKit": "GSE-test-item",
        "Overall_Cost": 1099,
        "KK_figure": 999,
        "": "",
        "Inverter_manufacturer": ""
    },
    "Tracker": {
        "": 59,
        "Submission_ref": "",
        "Client": "Lovell Partnerships west Midlands",
        "PV_NO": "06798PV",
        "REGION": 3,
        "PROJECT_NAME": "Rugby Radio Station (Lovell)",
        "DNO_MPAN_ref": 24,
        "DNO_NAME": "GTC",
        "REF_NUMBER": "N0016614-1",
        "SITE_LIVE": "",
        "Application_Type": "G98",
        "FORMAL_DNO_SUBMITTED": true,
        "SUBMISSION_DATE": "2022-05-10T23:00:00.000Z",
        "DNO_DUE_DATE": "2022-07-10T23:00:00.000Z",
        "DNO_Status": "6-Full Approval",
        "QUOTE_RECEIVED": "2022-06-23T23:00:00.000Z",
        "Customer_Invoiced_Date": "N/A",
        "DNO_Payment_Made": "N/A",
        "Acceptance_Form_returned": "2022-06-26T23:00:00.000Z",
        "DATE_APPROVED": "2022-06-29T23:00:00.000Z",
        "Comments": "",
        "Deadline_to_Connect": "",
        "twond_Fix_Date": "",
        "Commissioning_Form_Submitted": "",
        "Number_of_Plots_Loaded": 169,
        "Current_Project_Plots": 169,
        "Plots_approved": 0,
        "Approval_Progress____": 0,
        "Plots_With_Limiter_required": 0,
        "Plots_With_MPAN": 0,
        "Plots_With_Address": 0,
        "Auth_Letter_Sent": true,
        "Mpan_request_Sent": true,
        "Schematic_created": true,
        "Gnineeight_Application_created": true,
        "Gnineeightnine_Application_created": false,
        "Current_Total_kWp": 281,
        "Total_kWp_with_Limitation": 281,
        "Approved_kWp": "281kW",
        "kWp_from_Oscar": ""
    },
    "Site log": {
        "Internal_Ref": 59,
        "Project_Number": "06798PV",
        "client": "Lovell Partnerships west Midlands",
        "project_name": "Rugby Radio Station (Lovell)",
        "Region": "",
        "SITE_ADDRESS_LINE_one": "Gate 4, Rugby Radio Station",
        "SITE_ADDRESS_LINE_two": "Houlton",
        "SITE_TOWN": "Rugby",
        "SITE_COUNTY": "Warwickshire",
        "SITE_POSTCODE": "CV23 0AB",
        "DNo_responsible_name": "",
        "dno_responsible_email": "",
        "Site_manager_name": "",
        "Site_manager_email": "Stephen.Newell@lovell.co.uk",
        "site_manager_phone": "",
        "Client_address_one": "Lovell Partnerships west Midlands",
        "client_address_two_": "Building 7",
        "client_address_three": "18 Ridgeway",
        "Town": "Quinton Business Park",
        "County": "Birmingham",
        "Post_Code": "B32 1AF",
        "Contact_name": "",
        "Contact_Email": "",
        "File_name": "DNO Document Master.csv",
        "Load_Date": "2022-03-31T09:32:14.280Z"
    }
}

function prepareImportObject(importSheetData){

    var sheetData = {
        plotData: {
            "plotId": "",
            "projectId": "",
            "plotNumber": importSheetData.Plots.Plot_Number,
            "plotStatus": importSheetData.Plots.STATUS, // this really should be whether it's specified, signed off, or install
            "siteId": "", // Needs to be derived from site import function, so no direct mapping
            "housetype": "", //not found apparently
            "g99": importSheetData.Plots.Gninenine, // Assuming Gninenine indicates G99 compliance; adjust if necessary
            "mpan": importSheetData.Plots.Mpan,
            "plotAddressId": "", // Needs to be derived from address import function, so no direct mapping
            "plotApproved": importSheetData.Plots.Plot_Approved,
            "commissioningFormSubmitted": "", // No direct mapping available; needs clarification
            "trackerRef": importSheetData.Plots.Tracker_Ref,
            "legacyPlotID": importSheetData.Plots.Plot_ID,
            addressData: {
                "address_line_1": importSheetData.Plots.Postal_Name___Number,
                "address_line_2": importSheetData.Plots.Postal_Street,
                "address_town": importSheetData['Site log'].Town,
                "address_county": importSheetData['Site log'].County,
                "address_postcode": importSheetData.Plots.POSTAL_POSTCODE,
                "address_country": "UK", // Assuming UK; adjust if necessary
            },
            plotSpecData: {
                "plotSpecId": "", // Needs a UUID or a unique identifier; no direct mapping
                "plotId": "",
                "dateSpecified": "", // No direct mapping available; needs clarification or default value
                "specifiedBy": "", // No direct mapping available; needs user ID of the specifier
                "plotSpecStatus": "Specified", // No direct mapping available; needs status determination
                "phase": importSheetData.Plots.Phase,
                "p1": importSheetData.Plots.Pone,
                "p2": importSheetData.Plots.Ptwo,
                "p3": importSheetData.Plots.Pthree,
                "annualYield": importSheetData.Plots.Annual_Yield,
                "kwp": importSheetData.Plots.KWP,
                "kwpWithLimitation": importSheetData.Plots.kWp_with_limitation,
                "limiterRequired": importSheetData.Plots.Limiter_Required,
                "limiterValueIfNotZero": importSheetData.Plots.Limiter_Value_If_not_Zero,
                "labourCost": "", // No direct mapping available; might need to derive or set manually
                "meter": "",
                "meterCost": "", // No direct mapping available; might need to derive or set manually
                "battery": "", // No direct mapping available; adjust if necessary
                "batteryCost": "", // No direct mapping available; might need to derive or set manually
                "overallCost": importSheetData.Plots.Overall_Cost,
                "landlordSupply": importSheetData.Plots.Landlord_Supply
            },
            plotInstallData: {
                "plotInstallId": "", // Needs a UUID or a unique identifier; no direct mapping
                "plotId": "",
                "dateInstall": importSheetData.Plots.onest_fix_completion_date,
                "dateChecked": importSheetData.Plots.twond_fix_completion_date,
                "installBy": "", // No direct mapping available; needs user ID of the installer
                "checkedBy": "", // No direct mapping available; needs user ID of the checker
                "plotInstallStatus": "", // this should be if it's first fix, second fix, complete, remedial, or other. //todo
                "phase": importSheetData.Plots.Phase,
                "p1": importSheetData.Plots.Pone,
                "p2": importSheetData.Plots.Ptwo,
                "p3": importSheetData.Plots.Pthree,
                "annualYield": importSheetData.Plots.Annual_Yield,
                "kwp": importSheetData.Plots.KWP,
                "kwpWithLimitation": importSheetData.Plots.kWp_with_limitation,
                "limiterRequired": importSheetData.Plots.Limiter_Required,
                "limiterValueIfNotZero": importSheetData.Plots.Limiter_Value_If_not_Zero,
                "labourCost": "", // No direct mapping available; might need to derive or set manually
                "meter": "",
                "meterCost": "", // No direct mapping available; might need to derive or set manually
                "battery": "", // No direct mapping available; adjust if necessary
                "batteryCost": "", // No direct mapping available; might need to derive or set manually
                "overallCost": importSheetData.Plots.Overall_Cost,
                "mcsSubmissionId": "" // No direct mapping available; might use "MCS_Completed" or another field
            },
            siteData: {
                "siteName": importSheetData['Site log'].project_name,
                "addressData": {
                    "address_line_1": importSheetData['Site log'].SITE_ADDRESS_LINE_one,
                    "address_line_2": importSheetData['Site log'].SITE_ADDRESS_LINE_two,
                    "address_town": importSheetData['Site log'].SITE_TOWN,
                    "address_county": importSheetData['Site log'].SITE_COUNTY,
                    "address_postcode": importSheetData['Site log'].SITE_POSTCODE,
                    "address_country": "UK", // Assuming UK; adjust if necessary
                    "address_region_id": "",
                    "address_region_number": importSheetData.Tracker.REGION
                },
                userData: {
                    "sso_id": "", // not defined
                    "name": importSheetData['Site log'].Site_manager_name,
                    "email": importSheetData['Site log'].Site_manager_email,
                    "phone": importSheetData['Site log'].site_manager_phone,
                    "employer": importSheetData['Site log'].client,
                    "team": "", // No direct mapping available; needs clarification
                    "dispatch_id": "", // unlikely to be used
                    "snowy_role": "Site Manager", // they're a site manager
                    "company_role": "Site Manager",
                    "category": "Humans"
                },
                "mpanId": importSheetData.Plots.Mpan,
                "pvNumber": importSheetData.Plots.Project_Number
            },
            elevationData: {
                "plot_install_id": "", // Needs to be derived from plot installation details, so no direct mapping
                "plot_id": "",
                "type_test_ref": importSheetData.Plots.TYPE_TEST_Ref,
                "pitch": importSheetData.Plots.Pitch,
                "orientation": importSheetData.Plots.Orientation,
                "kk_figure": importSheetData.Plots.KK_figure,
                "kwp": importSheetData.Plots.KWP,
                "strings": importSheetData.Plots.Strings,
                "module_qty": importSheetData.Plots.MODULE_QTY,
                "inverter": importSheetData.Plots.INVERTER,
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "panel": importSheetData.Plots.PANEL_SPECIFIED,
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": importSheetData.Plots.RoofKit,
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": importSheetData.Plots.Annual_Yield
            },
            elevationSpecData: {
                "plot_spec_id": "", // Needs a UUID or a unique identifier; no direct mapping
                "plot_id": "",
                "type_test_ref": importSheetData.Plots.TYPE_TEST_Ref,
                "pitch": importSheetData.Plots.Pitch,
                "orientation": importSheetData.Plots.Orientation,
                "kk_figure": importSheetData.Plots.KK_figure,
                "kwp": importSheetData.Plots.KWP,
                "strings": importSheetData.Plots.Strings,
                "module_qty": importSheetData.Plots.MODULE_QTY,
                "inverter": importSheetData.Plots.INVERTER,
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "panel": importSheetData.Plots.PANEL_SPECIFIED,
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": importSheetData.Plots.RoofKit,
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": importSheetData.Plots.Annual_Yield
            },
            projectData: {
                "pvNumber": importSheetData.Tracker.PV_NO,
                clientData: {
                    "email": "", // No direct mapping in importSheetData, may need to derive or set manually
                    "name": importSheetData.Tracker.Client,
                    addressData: {
                        "address_line_1": importSheetData['Site log'].Client_address_one,
                        "address_line_2": importSheetData['Site log'].client_address_two_,
                        "address_town": importSheetData['Site log'].Town,
                        "address_county": importSheetData['Site log'].County,
                        "address_postcode": importSheetData['Site log'].Post_Code,
                        "address_country": "UK", // Assuming UK; adjust if necessary
                    },
                    userData: {
                        "sso_id": "", // not defined
                        "name": "",
                        "email": "",
                        "phone": "",
                        "employer": importSheetData.Tracker.Client,
                        "team": "", // No direct mapping available; needs clarification
                        "dispatch_id": "", // unlikely to be used
                        "snowy_role": "Client Contact", // they're a site manager
                        "company_role": "Client Contact",
                        "category": "Humans"
                    },
                },
                dnoDetails: {
                    "mpanId": "",
                    "dnoName": importSheetData.Tracker.DNO_NAME,
                    "refNumber": importSheetData.Tracker.DNO_MPAN_ref,
                    "dnoZone": importSheetData.Plots.DNO_Zone
                },
                projectProcessData: {
                    "project_process_id": "", // Needs a UUID or a unique identifier; no direct mapping
                    "approval_status": importSheetData.Tracker.DNO_Status,
                    "deadline_to_connect": importSheetData.Tracker.Deadline_to_Connect, // Assuming this field matches; may need conversion to Date
                    "auth_letter_sent": importSheetData.Tracker.Auth_Letter_Sent,
                    "mpan_request_sent": importSheetData.Tracker.Mpan_request_Sent,
                    "schematic_created": importSheetData.Tracker.Schematic_created,
                    "application_type": importSheetData.Tracker.Application_Type,
                    "formal_dno_submitted": importSheetData.Tracker.FORMAL_DNO_SUBMITTED,
                    "submission_date": importSheetData.Tracker.SUBMISSION_DATE, // May need conversion to Date
                    "dno_due_date": importSheetData.Tracker.DNO_DUE_DATE, // May need conversion to Date
                    "dno_status": importSheetData.Tracker.DNO_Status,
                    "approved_kwp": parseFloat(importSheetData.Tracker.Approved_kWp.replace("kW", "")), // Assuming the field contains "kW" and needs parsing as float
                    "quote_received": importSheetData.Tracker.QUOTE_RECEIVED !== "N/A", // Assuming "N/A" means no quote received
                    "customer_invoiced_date": importSheetData.Tracker.Customer_Invoiced_Date !== "N/A" ? importSheetData.Tracker.Customer_Invoiced_Date : null, // Assuming "N/A" means not invoiced
                    "dno_payment_made": importSheetData.Tracker.DNO_Payment_Made !== "N/A" ? importSheetData.Tracker.DNO_Payment_Made : null, // Assuming "N/A" means payment not made
                    "acceptance_form_returned": importSheetData.Tracker.Acceptance_Form_returned !== "", // Assuming an empty string means the form has not been returned
                    "date_approved": importSheetData.Tracker.DATE_APPROVED // May need conversion to Date
                },
                "additionalDetails": {
                    "refNumber": importSheetData.Tracker.REF_NUMBER,
                    "projectName": importSheetData.Tracker.PROJECT_NAME,
                    "jobCode": importSheetData.Tracker.PV_NO,
                    "comments": importSheetData.Tracker.Comments,
                    "dnoZone": importSheetData.Plots.DNO_Zone
                }
            }
        }
    }

    return sheetData;
}





const trackerSheetId = "1LxOveglR_AYMz7PnFyZrO3331vJHUoxp2AAdGcTs4LM";
const queryConfigByIndex = {
    sheetId: trackerSheetId,
    sheets: {
        Plots: {
            joinOn: "Job Code",
            searchIndex: 3001
        },
        Tracker: {
            joinOn: "Job Code"
        },
        "Site log": {
            joinOn: "job code"
        }
    }
};


// This script will try to import everything possible from the eco2 tracker
function main() {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var importId = insertImportEvent(conn, '', 'Site Log Import', 'Test Import', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

//let rowObject = querySheetsByIndex(queryConfigByIndex) //15-20seconds

    let importObject = prepareImportObject(testImportSheetData)

    // Logger.log(JSON.stringify(importObject))
    let result = importPlotData(conn, importId, importObject.plotData)
    console.log(result)
}



function testFunction() {


    Logger.log(JSON.stringify(rowObject))
}
