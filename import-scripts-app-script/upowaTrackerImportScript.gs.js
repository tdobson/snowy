

/*


var importSheetData = {
  "Plots": {
    "plot_id": 143,
    "site_id": 10,
    "Job_Code": "WAI-IVY",
    "Elevation_Number": "",
    "PLOT_NO": 61,
    "Housetype": 44407,
    "House_No_name": 10,
    "Street": "Hazel Lane",
    "Town": "Ivybridge",
    "Postcode": "PL21 0ZA",
    "MPAN": "",
    "Panel": "JA Black Half Cell 320W",
    "PANEL_kWp": 0.32,
    "P_Voltage": 38.05,
    "MCS_Code": "BABT 8515-163-R1-320W",
    "Orientation": "PORT",
    "Columns": 4,
    "Rows": 2,
    "Phase": "Single",
    "NO_Trackers": 1,
    "Total_Strings": 1,
    "String_one": 8,
    "String_two": "",
    "String_three": "",
    "String_four": "",
    "String_five": "",
    "String_six": "",
    "String_seven": "",
    "String_eight": "",
    "Inverter": "Solis Mini 2500",
    "Tracker_String_no_": "2023-01-01T00:00:00.000Z",
    "Hybrid": "-",
    "Type_Test_No": "ERD-CR202108007",
    "Rated_Output_Power": 2.5,
    "Battery": "NONE",
    "Mounting_Kit": "GSE",
    "Tile_Type": "PLAIN",
    "Roof_Incline": 35,
    "Variationo_From_South": 6,
    "kWh_kWp": 1090,
    "IN___ABOVE_ROOF": "IN",
    "ROOF_INCLINE": 35,
    "VARIATIONo_FROM_SOUTH": 5,
    "CARDINAL_DIRECTION": "S",
    "OVERSHADING_FACTOR": 1,
    "NO__PANELS": 8,
    "ARRAY_Mtwo": 13.456,
    "kWp": 2.56,
    "kWh": 2790.4,
    "COtwo_EQUIVALENT": 1448.2176000000002,
    "Net_kWp": 2.048,
    "Finished_Drawing": "",
    "Commissioning_Info_In": "2021-11-16T08:00:00.000Z",
    "MCS_Completed": "2021-11-05T07:00:00.000Z",
    "DNO_Document_Completed": "",
    "HO_Pack_Completed": "2021-11-17T08:00:00.000Z",
    "Shape": "",
    "Inverter_Mauf": "",
    "Protective_Device": "",
    "Building_Side": "",
    "Parcel": "",
    "Block_house": 306.8625,
    "Plot_requirement": 0,
    "Panels": 720,
    "Sundries": 150,
    "M_Labour": 320,
    "E_Labour": 150,
    "Dels_Certs": 80,
    "Total_Prime": 2321.7505,
    "Margin__": 0.45,
    "Total_Margin": 1045.2495,
    "Roof_Works": 2693.6,
    "Commissioning": 673.4000000000001,
    "PV_Total": 3367,
    "Profit__": 0.31043941193941194,
    "Total": 2046,
    "Difference": 1321,
    "Markup": 0.3,
    "DNO_Approval": false,
    "Export_Limitation__Required": false,
    "Export_Limitation": "",
    "onest_fix_complete": "2021-07-30T07:00:00.000Z",
    "twond_Fix_Complete": "2021-11-23T08:00:00.000Z",
    "onest_fix_Sales_Order": "",
    "onest_fix_Invoice_number": "",
    "twond_fix_Sales_Order": "",
    "twond_Fix_Invoice_Number": "",
    "Fully_Complete": "",
    "onest_fix_booked": "",
    "twond_fix_booked": ""
  },
  "Tracker": {
    "internal_Ref": 10,
    "Client_": "Wain Homes",
    "Job_Code": "WAI-IVY",
    "Site_name": "Ivy Bridge",
    "Number__Plots_Loaded": 161,
    "Current_Project_Plots": 161,
    "Plots_approved": 0,
    "Approval_Progress____": 0.8322981366459627,
    "onest_Fix_Complete": 139,
    "twond_Fix_Complete": 134,
    "onest_Fix_Invoiced": 0,
    "twond_Fix_Invoiced": 0,
    "Plots_With_Limiter_required": 0,
    "Plots_With_MPAN": 0,
    "Plots_With_Address": 160,
    "Auth_Letter_Sent": false,
    "Mpan_request_Sent": false,
    "Schematic_created": false,
    "Gnineeight_Application_created": false,
    "Site_plan_uploaded": true,
    "Rams": true,
    "Job_On_Hold": "",
    "Project_Complete": "",
    "Project_Invoiced": "",
    "Scheduler": "Kim",
    "site_address": "",
    "site_post_code": "",
    "Site_agent_name": "",
    "Site_agent_tel": "",
    "site_agent_email": "",
    "Site_Notes_": ""
  },
  "Site log": {
    "site_ID": 10,
    "job_code": "WAI-IVY",
    "cllient": "Wain Homes",
    "site_name": "Ivy Bridge",
    "site_address": "48 Weatherdon Dr, Ivybridge ",
    "site_post_code": "PL21 0DD",
    "zone": "Zone 4",
    "surveyor_name": "jason Dudytsch",
    "surveyor_tel": "",
    "surveyor_email": "",
    "Site_agent_name": "",
    "Site_agent_tel": "",
    "site_agent_email": "",
    "file_name_loaded_from": "Copy of WAI-IVY-MAP - MCS & PRICING (P) - OLD JOB RECOST.xlsm",
    "date_loaded": "2023-03-13T00:00:00.000Z",
    "Name_user_who_loaded": "admin@qms.upowa.co.uk",
    "Job_on_Hold": "",
    "SIte_Notes": ""
  }
}

*/


var sheetData = {
  "sheetData": {
    "plotData": {
      "plotId": "",
      "projectId": "", // not importSheetData.Plots.Job_Code
      "plotNumber": importSheetData.Plots.plot_id,
      "plotStatus": "", //  this is whether it's first fix, second fix, or fully complete //todo this is used by importStatus so must be defined
      "siteId": "", //needs to be derived from site import
      "housetype": importSheetData.Plots.Housetype,
      "g99": "", // No direct field in importSheetData for G99, might need a conditional mapping or additional data
      "mpan": importSheetData.Plots.MPAN,
      "plotAddressId": "", // needs to be derived from address import
      "plotSpecData": {
        "plotSpecId": "", // No direct mapping, needs a UUID or a unique identifier
        "plotId": sheetData.sheetData.plotData.plotId,
        "dateSpecified": "", // No direct field in importSheetData, might need to be derived or set manually
        "specifiedBy": "", // No direct field in importSheetData, needs user ID of the specifier
        "plotSpecStatus": "", // Likely to be "Speced" in the
        "phase": importSheetData.Plots.Phase,
        "p1": "", // No direct mapping, may need to derive from other data
        "p2": "", // No direct mapping, may need to derive from other data
        "p3": "", // No direct mapping, may need to derive from other data
        "annualYield": importSheetData.Plots.kWh,
        "kwp": importSheetData.Plots.kWp,
        "kwpWithLimitation": importSheetData.Plots.Net_kWp,
        "limiterRequired": importSheetData.Plots.Export_Limitation__Required,
        "limiterValueIfNotZero": "", // No direct field in importSheetData, needs conditional logic if limiter is required
        "labourCost": "", // No direct field, might aggregate from 'M_Labour' and 'E_Labour' or set manually
        "meter": "importSheetData.Plots.Inverter", // Assuming the inverter field is used here, might need adjustment
        "meterCost": "", // No direct field in importSheetData, might need manual setting or calculation
        "battery": importSheetData.Plots.Battery,
        "batteryCost": "", // No direct field in importSheetData, might need manual setting or calculation
        "overallCost": importSheetData.Plots.PV_Total,
        "landlordSupply": "" // No direct field in importSheetData, might need a boolean flag or manual setting
      },
      "plotInstallData": {
        "plotInstallId": "", // No direct mapping, needs a UUID or a unique identifier
        "plotId": sheetData.plotData.plotId,
        "dateInstall": "", // No direct field, might use 'onest_fix_complete' or 'twond_Fix_Complete' as a reference
        "dateChecked": "", // No direct field, might need to be derived or set manually
        "installBy": "", // No direct field, needs user ID of the installer
        "checkedBy": "", // No direct field, needs user ID of the checker
        "plotInstallStatus": "", // No direct mapping, needs status determination
        "phase": importSheetData.Plots.Phase,
        "p1": "", // No direct mapping, may need to derive from other data
        "p2": "", // No direct mapping, may need to derive from other data
        "p3": "", // No direct mapping, may need to derive from other data
        "annualYield": importSheetData.Plots.kWh,
        "kwp": importSheetData.Plots.kWp,
        "kwpWithLimitation": importSheetData.Plots.Net_kWp,
        "limiterRequired": importSheetData.Plots.Export_Limitation__Required,
        "limiterValueIfNotZero": "", // No direct field in importSheetData, needs conditional logic if limiter is required
        "labourCost": "", // No direct field, might aggregate from 'M_Labour' and 'E_Labour' or set manually
        "meter": importSheetData.Plots.Inverter, // Assuming the inverter field is used here, might need adjustment
        "meterCost": "", // No direct field in importSheetData, might need manual setting or calculation
        "battery": importSheetData.Plots.Battery,
        "batteryCost": "", // No direct field in importSheetData, might need manual setting or calculation
        "overallCost": importSheetData.Plots.PV_Total,
        "mcsSubmissionId": importSheetData.Plots.MCS_Completed // Assuming 'MCS_Completed' might be used as a submission ID
      },
      "siteData": {
        "addressData": {
          "address_line_1": importSheetData['Site log'].site_address || importSheetData.Tracker.site_address,
          "address_line_2": "", // No direct field in importSheetData for address line 2
          "address_town": "",
          "address_county": "", // No direct field in importSheetData for county
          "address_postcode": importSheetData['Site log'].site_post_code || importSheetData.Tracker.site_post_code,
          "address_country": "UK", // assume there's no ROI addresses
          "address_region_id": ""// todo is zone the same for upowa? "importSheetData['Site log'].zone" // Assuming 'zone' might be used as a region identifier
        },
        "userData": {
          "sso_id": "", // No direct field in importSheetData for SSO ID
          "name": importSheetData['Site log'].Site_agent_name || importSheetData.Tracker.Site_agent_name,
          "email": importSheetData['Site log'].site_agent_email || importSheetData.Tracker.site_agent_email,
          "phone": importSheetData['Site log'].Site_agent_tel || importSheetData.Tracker.Site_agent_tel,
          "employer": importSheetData['Site log'].cllient || importSheetData.Tracker.Client_,
          "team": "", // No direct field in importSheetData for team identifier
          "dispatch_id": "", // No direct field in importSheetData for dispatch ID
          "snowy_role": "Site Manager", // No direct field in importSheetData for Snowy application role
          "company_role": "Site Manager", // No direct field in importSheetData for company role
          "category": "Humans" // No direct field in importSheetData for category
        },
        "mpanId": importSheetData.Plots.MPAN,
        "pvNumber": importSheetData.Plots.Job_Code, // Assuming 'Job_Code' might be used as a PV number
        "siteName": importSheetData['Site log'].site_name
      },
      "addressData": {
            "addressData": {
              "address_line_1": importSheetData.Plots.House_No_name + ", " + importSheetData.Plots.Street,
              "address_line_2": "", // No direct field in importSheetData.Plots for address line 2
              "address_town": importSheetData.Plots.Town,
              "address_county": "", // No direct field in importSheetData.Plots for county
              "address_postcode": importSheetData.Plots.Postcode,
              "address_country": "UK", // Assuming the country is UK; adjust if necessary
              "address_region_id": "", // This would typically come from another data source or require additional logic to derive
              "address_region_number": "" // No direct field in importSheetData.Plots for region number; this might require additional data or logic
            },

          }
/
    },


  }
}








const trackerSheetId = "16oKLBkE05smVMLFqE10Bxh5lbHg6EoHDB9hwCtJzlrI";
const queryConfigByIndex = {
  sheetId: trackerSheetId,
  sheets: {
    Plots: {
      joinOn: "Job Code",
      searchIndex: 0
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
    var importId = insertImportEvent(conn, '', 'Site Log Import', 'Importing client and contact details', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

let rowObject = querySheetsByIndex(queryConfigByIndex)



    importProject(clientDataArray, conn, importId); // client importscript probs needs work
}


