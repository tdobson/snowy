// This script will try to import everything possible from the eco2 tracker
function main() {
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);
    var importId = insertImportEvent(conn, '', 'Site Log Import', 'Importing client and contact details', '4df57691-4d43-4cfb-9338-00e4cfafa63d');

    var clientDataArray = extractClientDataFromSheet();
    importClientData(clientDataArray, conn, importId);
}


/**
 * Extracts client and contact details from a Google Sheets spreadsheet named "Site Log".
 * Each row from the sheet is read and converted into an object, encapsulating the client and contact details.
 * The function assumes a specific structure of the sheet where headers define the keys for the data object.
 *
 * Prerequisites:
 * - Google Sheets document with a sheet named "Site Log" containing client and contact details.
 *
 * Usage:
 * - Call this function to retrieve an array of client data objects from the "Site Log" sheet.
 *
 * @returns {Object[]} An array of objects, each representing client and contact details extracted from the sheet.
 *   Each object contains:
 *     - name: String - Contact's name.
 *     - email: String - Contact's email address.
 *     - employer: String - Client's employer name.
 *     - snowy_role: String - Role within the Snowy application.
 *     - category: String - Category of the user (e.g., Human, Company, etc.).
 *     - address: Object - Address details, including:
 *       - address_line_1: String - The first line of the address.
 *       - address_line_2: String - The second line of the address.
 *       - address_line_3: String - The third line of the address.
 *       - address_town: String - The town of the address.
 *       - address_county: String - The county of the address.
 *       - address_postcode: String - The postcode of the address.
 */
 function extractClientDataFromSheet() {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Site Log");
     var data = sheet.getDataRange().getValues();
     var clientDataArray = [];

     for (var i = 1; i < data.length; i++) {
         var rowData = rowDataToObject(sheet, i + 1, 1, sheet.getLastColumn());

         var clientData = {
             name: rowData['Contact_name'],
             email: rowData['Contact_Email'],
             employer: rowData['client'],
             snowy_role: "Client",
             category: "Human",
             address: {
                 address_line_1: rowData['Client_address_1'],
                 address_line_2: rowData['client_address_2'],
                 address_line_3: rowData['client_address_3'],
                 address_town: rowData['Town'],
                 address_county: rowData['County'],
                 address_postcode: rowData['Post_Code']
             }
         };

         clientDataArray.push(clientData);
     }

     return clientDataArray;
 }


