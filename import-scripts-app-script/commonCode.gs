

These functions are available:

/**
 * Inserts an import event into the sn_import_events table and returns the import_id.
 *
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {string} importRef - Reference identifier for the import event.
 * @param {string} source - Source of the imported data.
 * @param {string} notes - Additional notes or comments about the import event.
 * @param {string} userId - User ID of the user performing the import.
 * @returns {string} The generated UUID for the new import event.
 */
function insertImportEvent(conn, importRef, source, notes, userId) {
  var importId = Utilities.getUuid();
  var currentDate = new Date();
  var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

  var importStmt = conn.prepareStatement('INSERT INTO sn_import_events (import_id, import_date, user_id, import_ref, import_source, import_notes) VALUES (?, ?, ?, ?, ?, ?)');
  importStmt.setString(1, importId);
  importStmt.setString(2, formattedDate);
  importStmt.setString(3, userId);
  importStmt.setString(4, importRef);
  importStmt.setString(5, source);
  importStmt.setString(6, notes);
  importStmt.execute();

  return importId;
}


/**
 * Retrieves a list of values from a specified column in a Google Sheet.
 *
 * @param {string} columnHeader - The header of the column from which to retrieve values.
 * @param {string} [sheetName] - The name of the sheet within the Spreadsheet.
 * @param {string} [spreadSheetID] - The ID of the Google Spreadsheet.
 * @returns {Array} An array of non-empty values from the specified column.
 */
function getColumnData(columnHeader, sheetName = null, spreadSheetID = null) {
  // If no spreadsheet ID is provided, use the active sheet
  if (!spreadSheetID) {
    var sheet = SpreadsheetApp.getActiveSheet();
    spreadSheetID = sheet.getSpreadsheetId();
    sheetName = sheet.getName();
  }

  // Open the specified Google Sheet by its ID
  var ss = SpreadsheetApp.openById(spreadSheetID);

  // Access the specific sheet by name
  var sheet = ss.getSheetByName(sheetName);

  // Get the data range of the sheet
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  // Find the index of the column with the specified header
  var columnIndex = values[0].indexOf(columnHeader);
  if (columnIndex == -1) {
    throw new Error('Column header not found');
  }

  // Extract the values from the specified column, skipping the header row
  // and filtering out empty values
  var columnValues = values.slice(1).map(row => row[columnIndex]).filter(value => value);

  // Return the array of non-empty values
  return columnValues;
}


/**
 * Converts selected row data into an object based on column headers. Columns with special chars are replaced with underscores.
 * 
 * @param {Sheet} sheet - The active sheet from which to fetch data.
 * @param {number} selectedRow - The index of the selected row.
 * @param {number} startColumn - The starting column index for data extraction.
 * @param {number} numColumns - The number of columns to extract.
 * @returns {Object} An object with key-value pairs based on column headers and row data.
 */
function rowDataToObject(sheet, selectedRow, startColumn, numColumns) {
  // Fetch column headers
  var headers = sheet.getRange(3, startColumn, 1, numColumns).getValues()[0];
  // Fetch data from the selected row
  var rowData = sheet.getRange(selectedRow, startColumn, 1, numColumns).getValues()[0];
  // Create an object to store the data
  var dataObject = {};

  // Iterate over each column, creating key-value pairs in the object
  for (var i = 0; i < numColumns; i++) {
    var header = headers[i];
    var headerAsProperty = header.replace(/[\s\W]+/g, '_');
    dataObject[headerAsProperty] = rowData[i];
  }

  return dataObject;
}




/**
 * Searches for a value in a specified column and returns a corresponding value from another column.
 *
 * @param {string} spreadsheetId - The ID of the spreadsheet.
 * @param {string} sheetName - The name of the sheet.
 * @param {string} searchColumnName - The name of the column to search in.
 * @param {string} returnColumnName - The name of the column from which to return the value.
 * @param {string} searchValue - The value to search for.
 * @returns {string} The value from the return column corresponding to the search value.
 */
function findValueInSheet(spreadsheetId, sheetName, searchColumnName, returnColumnName, searchValue) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  // Convert column names to the underscore format
  var formattedSearchColName = searchColumnName.replace(/[\s\W]+/g, '_');
  var formattedReturnColName = returnColumnName.replace(/[\s\W]+/g, '_');

  var searchColIndex = -1;
  var returnColIndex = -1;

  // Find the index of the search and return columns
  var headers = data[0];
  for (var i = 0; i < headers.length; i++) {
    var formattedHeader = headers[i].toString().replace(/[\s\W]+/g, '_');
    if (formattedHeader === formattedSearchColName) {
      searchColIndex = i;
    }
    if (formattedHeader === formattedReturnColName) {
      returnColIndex = i;
    }
  }

  if (searchColIndex === -1 || returnColIndex === -1) {
    throw new Error('Column not found.');
  }

  // Search for the value in the specified column
  for (var row = 1; row < data.length; row++) {
    if (data[row][searchColIndex].toString() === searchValue) {
      return data[row][returnColIndex].toString();
    }
  }

  return null; // Return null if no match is found
}

/**
 * Searches for values in specified columns and returns a corresponding value from another column.
 * All three search criteria must match for the function to return the value from the return column.
 *
 * @param {string} spreadsheetId - The ID of the spreadsheet.
 * @param {string} sheetName - The name of the sheet.
 * @param {string} plotSearchColumn - The name of the first column to search in.
 * @param {string} projectSearchColumn - The name of the second column to search in.
 * @param {string} goneAheadSearchColumn - The name of the third column to search in.
 * @param {string} returnColumnName - The name of the column from which to return the value.
 * @param {string} plotValue - The first value to search for.
 * @param {string} projectValue - The second value to search for.
 * @param {string} goneAheadValue - The third value to search for.
 * @returns {string} The value from the return column corresponding to the search values.
 */
function findValueInSheetWithThreeCriteria(spreadsheetId, sheetName, plotSearchColumn, projectSearchColumn, goneAheadSearchColumn, returnColumnName, plotValue, projectValue, goneAheadValue) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  var plotSearchIndex = -1;
  var projectSearchIndex = -1;
  var goneAheadSearchIndex = -1;
  var returnColIndex = -1;

  // Find the index of the search and return columns
  var headers = data[0];
  for (var i = 0; i < headers.length; i++) {
    var formattedHeader = headers[i].toString().replace(/[\s\W]+/g, '_');
    if (formattedHeader === plotSearchColumn.replace(/[\s\W]+/g, '_')) {
      plotSearchIndex = i;
    } else if (formattedHeader === projectSearchColumn.replace(/[\s\W]+/g, '_')) {
      projectSearchIndex = i;
    } else if (formattedHeader === goneAheadSearchColumn.replace(/[\s\W]+/g, '_')) {
      goneAheadSearchIndex = i;
    } else if (formattedHeader === returnColumnName.replace(/[\s\W]+/g, '_')) {
      returnColIndex = i;
    }
  }

  console.log(`Column indexes - Plot: ${plotSearchIndex}, Project: ${projectSearchIndex}, GoneAhead: ${goneAheadSearchIndex}, Return: ${returnColIndex}`);

  if (plotSearchIndex === -1 || projectSearchIndex === -1 || goneAheadSearchIndex === -1 || returnColIndex === -1) {
    throw new Error('One or more columns not found.');
  }

  // Search for the values in the specified columns
  for (var row = 1; row < data.length; row++) {
    var plotMatch = data[row][plotSearchIndex].toString() === plotValue.toString();
    var projectMatch = data[row][projectSearchIndex].toString().replace(/^0+/, '') === projectValue.replace(/^0+/, '');
    var goneAheadMatch = data[row][goneAheadSearchIndex].toString() === goneAheadValue.toString();

    //console.log(`Row ${row}: Plot match: ${plotMatch}, Project match: ${projectMatch}, GoneAhead match: ${goneAheadMatch}`);

    if (plotMatch && projectMatch && goneAheadMatch) {
      console.log(`Match found at row ${row}, returning value from column ${returnColIndex}`);
      return data[row][returnColIndex].toString();
    }
  }

  console.log('No match found');
  return null; // Return null if no match is found
}




