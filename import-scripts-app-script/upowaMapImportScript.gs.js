

/* import:
* plots
* projects
* products
* schedule
* devicemagic form return details
*/

//var testImportSheetData2 = {"plotData":{"plotId":"","projectId":"","plotNumber":"84","plotStatus":"","siteId":"","housetype":"","g99":"","mpan":"","plotAddressId":"","plotApproved":false,"commissioningFormSubmitted":"","trackerRef":124,"legacyPlotID":4710,"plotSpecData":{"plotSpecId":"","plotId":"","dateSpecified":"","specifiedBy":"","plotSpecStatus":"Specified","phase":"Single Phase","p1":0.7,"p2":0,"p3":0,"annualYield":648.81,"kwp":0.7,"kwpWithLimitation":0.7,"limiterRequired":false,"limiterValueIfNotZero":"","labourCost":"","meter":"","meterCost":"","battery":"","batteryCost":"","overallCost":1099,"landlordSupply":false},"plotInstallData":{"plotInstallId":"","plotId":"","dateInstall":"","dateChecked":"","installBy":"","checkedBy":"","plotInstallStatus":"","phase":"Single Phase","p1":0.7,"p2":0,"p3":0,"annualYield":648.81,"kwp":0.7,"kwpWithLimitation":0.7,"limiterRequired":false,"limiterValueIfNotZero":"","labourCost":"","meter":"","meterCost":"","battery":"","batteryCost":"","overallCost":1099,"mcsSubmissionId":""},"siteData":{"siteName":"St Andrews Park,Lutterworth Road, Franklyn Fields","addressData":{"address_line_1":"Gate 4, Rugby Radio Station","address_line_2":"Houlton","address_town":"Rugby","address_county":"Warwickshire","address_postcode":"CV23 0AB","address_country":"UK","address_region_id":"","address_region_number":3},"userData":{"sso_id":"","name":"","email":"Stephen.Newell@lovell.co.uk","phone":"","employer":"Lovell Partnerships west Midlands","team":"","dispatch_id":"","snowy_role":"Site Manager","company_role":"Site Manager","category":"Humans"},"mpanId":"","pvNumber":"02501PV"},"elevationData":{"plot_install_id":"","plot_id":"","type_test_ref":"SOLIS/03638/V1","pitch":34,"orientation":75,"kk_figure":999,"kwp":0.7,"strings":1,"module_qty":3,"inverter":"Solis-mini-700-S5","inverter_cost":"","panel":"270w Viridian Poly Black","panel_cost":"","panels_total_cost":"","roof_kit":"GSE-test-item","roof_kit_cost":"","annual_yield":648.81},"elevationSpecData":{"plot_spec_id":"","plot_id":"","type_test_ref":"SOLIS/03638/V1","pitch":34,"orientation":75,"kk_figure":999,"kwp":0.7,"strings":1,"module_qty":3,"inverter":"Solis-mini-700-S5","inverter_cost":"","panel":"270w Viridian Poly Black","panel_cost":"","panels_total_cost":"","roof_kit":"GSE-test-item","roof_kit_cost":"","annual_yield":648.81},"projectData":{"pvNumber":"06798PV","clientData":{"email":"","name":"Lovell Partnerships west Midlands","addressData":{"address_line_1":"Lovell Partnerships west Midlands","address_line_2":"Building 7","address_town":"Quinton Business Park","address_county":"Birmingham","address_postcode":"B32 1AF","address_country":"UK"}},"dnoDetails":{"mpanId":"","dnoName":"GTC","refNumber":24,"dnoZone":6},"projectProcessData":{"project_process_id":"","approval_status":"6-Full Approval","deadline_to_connect":"","auth_letter_sent":true,"mpan_request_sent":true,"schematic_created":true,"application_type":"G98","formal_dno_submitted":true,"submission_date":"2022-05-10T23:00:00.000Z","dno_due_date":"2022-07-10T23:00:00.000Z","dno_status":"6-Full Approval","approved_kwp":281,"quote_received":true,"customer_invoiced_date":null,"dno_payment_made":null,"acceptance_form_returned":true,"date_approved":"2022-06-29T23:00:00.000Z"},"additionalDetails":{"refNumber":"N0016614-1","projectName":"Rugby Radio Station (Lovell)","jobCode":"06798PV","comments":"","dnoZone":6}}}}


/* var testImportSheetData = {
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
*/
function prepareImportObject(importSheetData){

    var sheetData = {
        plotData: {
            "plotId": "",
            "projectId": "",
            "plotNumber": importSheetData.MAP.Plot_Number,
            "plotStatus": "Specified", // this really should be whether it's specified, signed off, or install or complete
            "siteId": "", // Needs to be derived from site import function, so no direct mapping
            "housetype": importSheetData.MAP.Housetype,
            "g99": "", // Assuming Gninenine indicates G99 compliance; adjust if necessary
            "mpan": importSheetData.Total_Costing.MPAN,
            "plotAddressId": "", // Needs to be derived from address import function, so no direct mapping
            "plotApproved": "true",
            "commissioningFormSubmitted": "", // No direct mapping available; needs clarification
            "trackerRef": "",
            "legacyPlotID": importSheetData.MAP.Plot_Number,
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
                "kwp": importSheetData.MAP.KWP,
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
                        Plot_Requirement: importSheetData.Total_Costing.Plot_Requirement,
                        Block___House: importSheetData.Total_Costing.Block___House,
                        PV_Diverter: importSheetData.Total_Costing.PV_Diverter,
                        Model_Number: importSheetData.Total_Costing.Model_Number,
                        Rated_Output__W_: importSheetData.Total_Costing.Rated_Output__W_,
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
                "annual_yield": ""
            },
            elevationSpecData: {
                "plot_spec_id": "", // Needs a UUID or a unique identifier; no direct mapping
                "plot_id": "",
                "type_test_ref": "",
                "pitch": importSheetData.MAP.Roof_Incline,
                "orientation": importSheetData.MAP.CARDINAL_DIRECTION,
                "kk_figure": importSheetData.MAP.KWh_KWp,
                "kwp": importSheetData.MAP.KWp,
                "strings": importSheetData.MAP.Total_Strings,
                "module_qty": importSheetData.MAP.NO___PANELS,
                "inverter": importSheetData.Total_Costing.Inverter,
                "inverter_cost": "", // No direct mapping available; might need to derive or set manually
                "panel": importSheetData.MAP.Panel,
                "panel_cost": "", // No direct mapping available; might need to derive or set manually
                "panels_total_cost": "", // No direct mapping available; might need to aggregate panel costs or set manually
                "roof_kit": importSheetData.MAP.Mounting,
                "roof_kit_cost": "", // No direct mapping available; might need to derive or set manually
                "annual_yield": "",
                customFields: {
                    entityType: 'elevationSpec',
                    fields: {
                        Mounting: importSheetData.MAP.Mounting,
                        Tile_Type: importSheetData.MAP.Tile_Type,
                        Elevation_No: importSheetData.MAP.Elevation_No,
                        Building_Side: importSheetData.MAP.Building_Side,
                        Input_Roof_Incline: importSheetData.MAP.Input_Roof_Incline,
                        Input_Variation_from_South: importSheetData.MAP.Input_Variation_from_South
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
            searchIndex: 3
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

// This script will try to import everything possible from the upowa map file
function main() {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var details = insertInstanceAndGetUuid(conn, clientObject)

    var importId = insertImportEvent(conn, details.instanceId , '', 'Site Log Import', 'Test Import', details.adminUserId);

    let rowObject = querySheetsByIndexWithSpecialSheet(queryConfigByIndex); //15-20seconds
    Logger.log(JSON.stringify(rowObject));

    if (rowObject.matched === false) {
        console.log("No matching data found in the 'Total Costing' sheet for the specified row index in the 'MAP' sheet.");
        console.log("exiting")
        return 0
    }

    let importObject = prepareImportObject(rowObject);
    Logger.log(JSON.stringify(importObject));

    let result = importPlotData(conn, details.instanceId, importId, importObject.plotData);
    console.log(result);
}



function testFunction() {


    Logger.log(JSON.stringify(rowObject))
}
