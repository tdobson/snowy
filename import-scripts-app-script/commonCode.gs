

// These functions are available:

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

    var importStmt = conn.prepareStatement('INSERT INTO sn_import_events '
        + '(import_id, import_date, imported_by, modified_date, modified_by, modification_ref, import_ref, import_source, import_notes) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

    importStmt.setString(1, importId);
    importStmt.setString(2, formattedDate);
    importStmt.setString(3, userId); // imported_by
    importStmt.setString(4, formattedDate); // modified_date
    importStmt.setString(5, userId); // modified_by
    importStmt.setString(6, ''); // modification_ref, assuming no value for new import, can be updated later
    importStmt.setString(7, importRef);
    importStmt.setString(8, source);
    importStmt.setString(9, notes);

    importStmt.execute();

    return importId;
}

/**
 * Inserts or updates an import event in the sn_import_events table. This function handles both new event insertion
 * and updating existing events based on the provided event details. If an import_id is provided and valid, the function
 * updates the existing event; otherwise, it creates a new event.
 *
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {Object} eventData - An object containing the details of the event. Expected properties:
 *   - {string} [importId] - (Optional) The import ID of an existing event to update.
 *   - {string} importRef - Reference identifier for the event.
 *   - {string} source - Source of the imported data.
 *   - {string} notes - Additional notes or comments about the event.
 *   - {string} userId - User ID of the user performing the operation.
 * @returns {string} The import_id of the inserted or updated event.
 */
function insertOrUpdateImportEvent(conn, eventData) {
    var currentDate = new Date();
    var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    if (eventData.importId) {
        // Update existing event
        var updateStmt = conn.prepareStatement('UPDATE sn_import_events SET modified_date = ?, modified_by = ?, import_notes = ?, import_source = ? WHERE import_id = ?');
        updateStmt.setString(1, formattedDate);
        updateStmt.setString(2, eventData.userId);
        updateStmt.setString(3, eventData.notes);
        updateStmt.setString(4, eventData.source);
        updateStmt.setString(5, eventData.importId);
        updateStmt.execute();

        return eventData.importId;
    } else {
        // Insert new event
        var newImportId = Utilities.getUuid();
        var insertStmt = conn.prepareStatement('INSERT INTO sn_import_events '
            + '(import_id, import_date, imported_by, modified_date, modified_by, modification_ref, import_ref, import_source, import_notes) '
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, newImportId);
        insertStmt.setString(2, formattedDate);
        insertStmt.setString(3, eventData.userId);
        insertStmt.setString(4, formattedDate);
        insertStmt.setString(5, eventData.userId);
        insertStmt.setString(6, ''); // Assuming no modification_ref for new event
        insertStmt.setString(7, eventData.importRef);
        insertStmt.setString(8, eventData.source);
        insertStmt.setString(9, eventData.notes);
        insertStmt.execute();

        return newImportId;
    }
}



/**
 * Inserts or updates an event in the sn_import_events table. If an event with the given importRef already exists,
 * it updates the modification details; otherwise, it inserts a new event and returns the import_id.
 *
 * @param {JdbcConnection} conn - The JDBC connection to the database.
 * @param {string} importRef - Reference identifier for the event.
 * @param {string} source - Source of the imported data.
 * @param {string} notes - Additional notes or comments about the event.
 * @param {string} userId - User ID of the user performing the operation.
 * @returns {string} The import_id of the existing or new event.
 */
function insertUpdateEvent(conn, importRef, source, notes, userId) {
    var currentDate = new Date();
    var formattedDate = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), "yyyy-MM-dd");

    // Check if the event with the given importRef exists
    var checkEventStmt = conn.prepareStatement('SELECT * FROM sn_import_events WHERE import_ref = ?');
    checkEventStmt.setString(1, importRef);
    var rs = checkEventStmt.executeQuery();

    if (rs.next()) {
        // Event exists, update the modification details
        var existingImportId = rs.getString('import_id');
        var updateStmt = conn.prepareStatement('UPDATE sn_import_events SET modified_date = ?, modified_by = ?, import_notes = ?, import_source = ? WHERE import_id = ?');

        updateStmt.setString(1, formattedDate);
        updateStmt.setString(2, userId);
        updateStmt.setString(3, notes);
        updateStmt.setString(4, source);
        updateStmt.setString(5, existingImportId);

        updateStmt.execute();
        return existingImportId;
    } else {
        // Insert a new event
        var newImportId = Utilities.getUuid();
        var insertStmt = conn.prepareStatement('INSERT INTO sn_import_events '
            + '(import_id, import_date, imported_by, modified_date, modified_by, modification_ref, import_ref, import_source, import_notes) '
            + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

        insertStmt.setString(1, newImportId);
        insertStmt.setString(2, formattedDate);
        insertStmt.setString(3, userId);
        insertStmt.setString(4, formattedDate);
        insertStmt.setString(5, userId);
        insertStmt.setString(6, ''); // Assuming no modification_ref for new event
        insertStmt.setString(7, importRef);
        insertStmt.setString(8, source);
        insertStmt.setString(9, notes);

        insertStmt.execute();
        return newImportId;
    }
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




/**
 * Retrieves values from specified columns in a Google Sheets spreadsheet.
 *
 * @param {string} sheetId - The ID of the spreadsheet.
 * @param {string} sheetName - The name of the individual sheet within the spreadsheet.
 * @param {Object} columnObject - An object where the keys are property names and the values are column names in the sheet.
 *
 * @returns {Object} An object with the same keys as columnObject, where the values are either the first non-falsy value found in the respective column or an error message ("Value not found" or "Column not found").
 *
 * @example
 *
 * var result = getSheetValues('yourSheetIdHere', 'yourSheetNameHere', {columnMan: "Name", columnLady: "LastName"});
 * console.log(result);
 * // Output might be: {columnMan: "Bob", columnLady:"Monroe"}
 *
 */
function querySheets(sheetId, selectColumns, fromSheets, joinOn, where) {
  var spreadsheet = SpreadsheetApp.openById(sheetId);
  var sheet1 = spreadsheet.getSheetByName(fromSheets[0]);
  var sheet2 = spreadsheet.getSheetByName(fromSheets[1]);

  var data1 = sheet1.getDataRange().getValues();
  var data2 = sheet2.getDataRange().getValues();

  var headers1 = data1[0];
  var headers2 = data2[0];

  var joinIndex1 = headers1.indexOf(joinOn[0]);
  var joinIndex2 = headers2.indexOf(joinOn[1]);

  var selectIndices1 = selectColumns[0].map(function(col) { return headers1.indexOf(col); });
  var selectIndices2 = selectColumns[1].map(function(col) { return headers2.indexOf(col); });

  var whereColumnIndex = headers1.indexOf(where.column);



  var result = [];

  for(var i = 1; i < data1.length; i++) {
    for(var j = 1; j < data2.length; j++) {
      if(data1[i][joinIndex1] === data2[j][joinIndex2] && data1[i][whereColumnIndex] === where.value) {
        var row = {};
        selectIndices1.forEach(function(idx) {
          if(idx !== -1) row[formatColumnName(headers1[idx])] = data1[i][idx];
        });
        selectIndices2.forEach(function(idx) {
          if(idx !== -1) row[formatColumnName(headers2[idx])] = data2[j][idx];
        });
        result.push(row);
      }
    }
  }
  return result;
}


function formatColumnName(name) {
  // Replace non-alphanumeric characters with underscores
  name = name.replace(/[^a-zA-Z0-9]/g, '_');

  // Replace numbers with words
  const numberToWordMap = {
    '0': 'zero',
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five',
    '6': 'six',
    '7': 'seven',
    '8': 'eight',
    '9': 'nine',
  };

  name = name.replace(/[0-9]/g, (match) => numberToWordMap[match]);

  return name;
}


function filter2dArray(array, columnName, search) {
  for(let i = 0; i < array.length; i++) {
    if(String(array[i][columnName]) === String(search)) {
      return array[i];
    }
  }
  return null; // or an empty array [] depending on what you want to return when no match is found
}




function searchValueInSheet(sheetId, sheetName, searchColumnName, searchValue, returnColumnName) {
  try {
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);

    // Get the first row of the sheet (column names)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Format the column names using the formatColumnName function
    var formattedHeaders = headers.map(formatColumnName);
console.log("Search Col Name", searchColumnName)
    // Find the index of the formatted search column
    var searchColumnIndex = formattedHeaders.indexOf(formatColumnName(searchColumnName));

    if (searchColumnIndex !== -1) {
      // Get all data rows
      var data = sheet.getDataRange().getValues();

      // Iterate through data rows
      for (var i = 1; i < data.length; i++) { // Start from 1 to skip header row
        var rowData = data[i];

        // Check if the search value matches the value in the search column
        if (rowData[searchColumnIndex] === searchValue) {
          // Find the index of the formatted return column
          var returnColumnIndex = formattedHeaders.indexOf(formatColumnName(returnColumnName));

          if (returnColumnIndex !== -1) {
            // Return the value from the return column in the matching row
            return rowData[returnColumnIndex];
          }
        }
      }
      // If no matching row is found, return an appropriate message or value
      return "No matching row found";
    } else {
      // If the search column is not found, return an error message
      return "Search column not found";
    }
  } catch (error) {
    // Handle any errors that may occur during execution
    console.log(searchColumnName, searchValue, returnColumnName)
    return "Error: " + error.message;
  }
}

function checkForNullAndNotCreated(trackerValuesbyPlotNumber) {
  const properties = ["Mpan", "SITE_ADDRESS_LINE_one", "SITE_ADDRESS_LINE_two", "SITE_TOWN", "CountyID", "SITE_POSTCODE", "Overall_Cost", "Project_Plot", "Annual_Yield", "Standalone", "RoofKit"];

if (trackerValuesbyPlotNumber === null){
  trackerValuesbyPlotNumber = {}
}

  for (const property of properties) {
    if (!trackerValuesbyPlotNumber.hasOwnProperty(property)) {
      trackerValuesbyPlotNumber[property] = "Value not found";
    } else if (trackerValuesbyPlotNumber[property] === null) {
      trackerValuesbyPlotNumber[property] = "Value not found";
    }
  }

  return trackerValuesbyPlotNumber;
}


function searchForMatch(plotNumber, projectNumber, sheetName, columnIndex1, columnIndex2) {
  var spreadsheet = SpreadsheetApp.openById(mcsSheetID);
  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }

  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) { // Start from row 2 (index 1)
    var row = data[i];
    var cellValue1 = row[columnIndex1 - 1].toString(); // Adjust for 1-based index
    var cellValue2 = row[columnIndex2 - 1].toString(); // Adjust for 1-based index
    //console.log(cellValue1, cellValue2)
    if (cellValue1 === plotNumber.toString() && cellValue2 === projectNumber.toString()) {
      return true;
    }
  }

  return false;
}

function appendToSheet(sheet, data) {
  // this may be causing problems by not handling the data object right when setting error messages, but we'll see
  var startRow = sheet.getLastRow() + 1;
  var numRows = data.length;
  var numCols = data[0].length;
  var range = sheet.getRange(startRow, 1, numRows, numCols);

  // If the number of rows in the data is less than the number of rows in the range,
  // adjust the range to match the number of rows in the data
  if (numRows < range.getNumRows()) {
    var diffRows = range.getNumRows() - numRows;
    range = sheet.getRange(startRow, 1, numRows + diffRows, numCols);
  }

  range.setValues(data);


  // Resize columns to fit data
  sheet.autoResizeColumns(1, numCols);
}


function getCountyFromPostcode(postcode) {
  try {
    var response = UrlFetchApp.fetch("https://wikishire.co.uk/lookup/postcode?pc=" + encodeURIComponent(postcode));
    var data = response.getContentText();


      return data;

  } catch (error) {
    console.error("Error fetching county: ", error.message);
    return null;
  }
}

function setCountyID(trackerValuesbyPlotNumber, mcsSheetID) {
  var countyID = 0;

  if (trackerValuesbyPlotNumber) {
    if (trackerValuesbyPlotNumber.SITE_POSTCODE) {
      let countyName = getCountyFromPostcode(trackerValuesbyPlotNumber.SITE_POSTCODE);
      if (countyName !== '' && countyName !== null) {
        console.log(countyName);
        countyID = searchValueInSheet(mcsSheetID, "County MCS Lookups", "Description", countyName, "ID");
        if (typeof countyID === 'undefined' || countyID.includes("found")) countyID = "0";
        return countyID;
      }
    }

    if (trackerValuesbyPlotNumber.POSTAL_POSTCODE) {
      let countyName = getCountyFromPostcode(trackerValuesbyPlotNumber.POSTAL_POSTCODE);
      if (countyName !== '' && countyName !== null) {
        console.log(countyName);
        countyID = searchValueInSheet(mcsSheetID, "County MCS Lookups", "Description", countyName, "ID");
      if (typeof countyID === 'undefined' || countyID.includes("found")) countyID = "0";
        return countyID;
      } else {
        console.error("County name not found");
        countyID = 0;
        return countyID;
      }
    } else {
      console.error("Both trackerValuesbyPlotNumber.SITE_POSTCODE and trackerValuesbyPlotNumber.POSTAL_POSTCODE are undefined");
      countyID = 0;
      return countyID;
    }
  } else {
    console.error("trackerValuesbyPlotNumber is undefined");
    countyID = 0;
    return countyID;
  }
}


function convertNumbersAndBooleansToStrings(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "number" && obj[key] === 0) {
        obj[key] = String(obj[key]);
      } else if (typeof obj[key] === "boolean") {
        obj[key] = String(obj[key]);
      } else if (typeof obj[key] === "object") {
        // If the property is an object, recursively call the function
        convertNumbersAndBooleansToStrings(obj[key]);
      }
    }
  }
}
