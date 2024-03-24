

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




/**
 * Writes values to specified columns in multiple Google Sheets based on the provided data map.
 *
 * @param {string} sheetId - The ID of the spreadsheet.
 * @param {Object} dataObject - An object containing the data to write. The keys should match the keys in the data map.
 * @param {Object} dataMap - An object defining the mapping between the dataObject keys and the columns in each sheet.
 * @param {string[]} sheetsToUpdate - An array of sheet names to update.
 */
function writeSheets(sheetId, dataObject, dataMap, sheetsToUpdate) {
    var spreadsheet = SpreadsheetApp.openById(sheetId);

    sheetsToUpdate.forEach(sheetName => {
        var sheet = spreadsheet.getSheetByName(sheetName);
        var headers = sheet.getDataRange().getValues()[0];
        var writeRow = findRowToWrite(sheet, dataObject, headers, dataMap[sheetName]);

        if (writeRow !== -1) {
            Object.keys(dataMap[sheetName]).forEach(key => {
                var columnIndex = headers.indexOf(dataMap[sheetName][key]);
                if (columnIndex !== -1) {
                    sheet.getRange(writeRow, columnIndex + 1).setValue(dataObject[key]);
                }
            });
        }
    });
}

/**
 * Finds the row to write the data to, based on a unique identifier in the dataObject.
 * This function assumes that the unique identifier is the first key-value pair in the dataObject.
 *
 * @param {Sheet} sheet - The Google Sheet object.
 * @param {Object} dataObject - The data object containing the values to write.
 * @param {string[]} headers - The headers of the sheet.
 * @param {Object} dataMapForSheet - The data map for the current sheet.
 * @returns {number} The row number to write the data to.
 */
function findRowToWrite(sheet, dataObject, headers, dataMapForSheet) {
    var uniqueIdKey = Object.keys(dataObject)[0];
    var uniqueIdColumn = dataMapForSheet[uniqueIdKey];
    var uniqueIdColumnIndex = headers.indexOf(uniqueIdColumn);

    if (uniqueIdColumnIndex === -1) {
        throw new Error("Unique identifier column not found in the sheet.");
    }

    var dataRange = sheet.getDataRange().getValues();
    for (var i = 1; i < dataRange.length; i++) {
        if (dataRange[i][uniqueIdColumnIndex].toString() === dataObject[uniqueIdKey].toString()) {
            return i + 1; // Sheet row numbers are 1-indexed
        }
    }

    // Return -1 if the unique identifier is not found
    return -1;
}

/**
 * Searches for a value in a specified column and returns corresponding values from multiple columns.
 *
 * @param {string} spreadsheetId - The ID of the spreadsheet.
 * @param {string} sheetName - The name of the sheet.
 * @param {string} searchColumnName - The name of the column to search in.
 * @param {string[]} returnColumnNames - Array of names of the columns from which to return the values.
 * @param {string} searchValue - The value to search for.
 * @returns {Array} An array of objects with key-value pairs corresponding to the return columns.
 */
function getColumns(spreadsheetId, sheetName, searchColumnName, returnColumnNames, searchValue) {
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  var searchColIndex = data[0].indexOf(searchColumnName);
  if (searchColIndex === -1) {
    throw new Error('Search column not found');
  }

  var returnColIndices = returnColumnNames.map(name => data[0].indexOf(name));
  if (returnColIndices.includes(-1)) {
    throw new Error('One or more return columns not found');
  }

  var matchingRows = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][searchColIndex].toString() === searchValue) {
      var rowObject = {};
      returnColIndices.forEach((colIndex, idx) => {
        rowObject[returnColumnNames[idx]] = data[i][colIndex];
      });
      matchingRows.push(rowObject);
    }
  }

  return matchingRows;
}


/**
 * Retrieves and joins data from multiple sheets in a Google Sheets spreadsheet based on specified criteria,
 * returning a structured output with data grouped by sheet names. This function allows for flexible querying,
 * including selecting specific columns, joining on common columns, and applying multiple search criteria on one sheet.
 *
 * @param {Object} config - Configuration object for specifying query details.
 * @param {string} config.sheetId - The ID of the Google Sheets spreadsheet.
 * @param {Object} config.sheets - An object where each key is a sheet name and each value is an object containing:
 *   @param {Array<string>} [config.sheets.SheetName.returnColumns] - Optional. Array of column names to be returned from the sheet. If omitted, all columns are returned.
 *   @param {string} config.sheets.SheetName.joinOn - The column name used to join this sheet with others.
 *   @param {Object} [config.sheets.SheetName.where] - Optional. An object specifying search criteria with up to two conditions:
 *     @param {string} config.sheets.SheetName.where.searchColumn1 - The column name for the first search criterion.
 *     @param {string|number} config.sheets.SheetName.where.searchValue1 - The value to match for the first search criterion.
 *     @param {string} [config.sheets.SheetName.where.searchColumn2] - Optional. The column name for the second search criterion.
 *     @param {string|number} [config.sheets.SheetName.where.searchValue2] - Optional. The value to match for the second search criterion.
 *
 * @returns {Array<Object>} An array of objects, where each object represents joined rows from the specified sheets,
 * with each sheet's data as a subobject. The keys of these subobjects are the sheet names, and their values are objects
 * with keys as the selected (or all) column names (formatted to remove spaces and special characters) and their corresponding values.
 *
 * @example
 * // Example input:
 * const queryConfig = {
 *   sheetId: "1A2B3C4D5E6F7G8H9I0J",
 *   sheets: {
 *     Sheet1: {
 *       returnColumns: ["site id", "Job Code", "Town", "Postcode"],
 *       joinOn: "Job Code"
 *     },
 *     Sheet2: {
 *       returnColumns: ["Client", "Job Code", "Site name", "Current Project Plots"],
 *       joinOn: "Job Code"
 *     },
 *     Sheet3: {
 *       joinOn: "Job Code",
 *       where: {
 *         searchColumn1: "site id",
 *         searchValue1: "1234",
 *         searchColumn2: "Plot Number",
 *         searchValue2: "5678"
 *       }
 *     }
 *   }
 * };
 *
 * // Example output:
 * [
 *   {
 *     "Sheet1": {
 *       "siteId": "1234",
 *       "JobCode": "J123",
 *       "Town": "Sampletown",
 *       "Postcode": "ST123"
 *     },
 *     "Sheet2": {
 *       "Client": "SampleClient",
 *       "JobCode": "J123",
 *       "SiteName": "Sample Site",
 *       "CurrentProjectPlots": "5"
 *     },
 *     "Sheet3": {
 *       "siteId": "1234",
 *       "JobCode": "J123",
 *       "PlotNumber": "5678"
 *     }
 *   }
 *   // Additional objects for each matching and joined row
 * ]
 *
 * @description
 * The function operates in several steps:
 * 1. Load and preprocess data from each specified sheet, selecting the required columns or all if unspecified.
 * 2. Apply the specified search criteria to filter the data in the sheet with the 'where' condition.
 * 3. Perform a join operation across the sheets based on the 'joinOn' column, only including rows that match the join condition and the search criteria.
 * 4. Structure the joined data into a cohesive output format, grouping each row's data by the originating sheet and formatting column names.
 */function querySheetsWithStructuredData(config) {
     const spreadsheet = SpreadsheetApp.openById(config.sheetId);
     const sheetData = {};

     // Load and structure data from each sheet based on the new config structure
     Object.keys(config.sheets).forEach(sheetName => {
       const sheet = spreadsheet.getSheetByName(sheetName);
       const data = sheet.getDataRange().getValues();
       const headers = data[0];
       const selectColumns = config.sheets[sheetName].returnColumns || headers; // Select specified columns or all if undefined
       const selectIndices = selectColumns.map(col => headers.indexOf(col));

       sheetData[sheetName] = data.slice(1).map(row => {
         const rowData = {};
         selectIndices.forEach((index, i) => {
           const cellValue = row[index];
           // Check if the cell value is not blank before adding to rowData
           if (index !== -1 && cellValue !== "" && cellValue !== null && cellValue !== undefined) {
             rowData[formatColumnName(selectColumns[i])] = cellValue;
           }
         });
         return rowData;
       });
     });

     // Apply search criteria
     const whereSheetName = Object.keys(config.sheets).find(sheetName => config.sheets[sheetName].where);
     const whereConfig = config.sheets[whereSheetName].where;
     const filteredData = sheetData[whereSheetName].filter(row =>
       row[formatColumnName(whereConfig.searchColumn1)] === whereConfig.searchValue1 &&
       (whereConfig.searchColumn2 ? row[formatColumnName(whereConfig.searchColumn2)] === whereConfig.searchValue2 : true));

     // Join data based on 'joinOn' key and filtered data from the 'where' sheet
     const joinedData = [];
     filteredData.forEach(row => {
       const joinValue = row[formatColumnName(config.sheets[whereSheetName].joinOn)];
       const joinedRow = {};

       Object.keys(sheetData).forEach(sheetName => {
         const joinColumn = formatColumnName(config.sheets[sheetName].joinOn);
         const matchingRow = sheetData[sheetName].find(r => r[joinColumn] === joinValue);

         if (matchingRow) {
           // Filter out blank values from matchingRow before adding to joinedRow
           const nonBlankRow = Object.entries(matchingRow).reduce((acc, [key, value]) => {
             if (value !== "" && value !== null && value !== undefined) {
               acc[key] = value;
             }
             return acc;
           }, {});

           if (Object.keys(nonBlankRow).length > 0) { // Only add if there are non-blank columns
             joinedRow[sheetName] = nonBlankRow;
           }
         }
       });

       if (Object.keys(joinedRow).length === Object.keys(config.sheets).length) { // Ensure data from all sheets are present
         joinedData.push(joinedRow);
       }
     });

     return joinedData;
   }


/**
 * Joins data from multiple sheets in a Google Sheets spreadsheet based on a specified row index from one sheet and corresponding matching data in other sheets. This function is designed to use a particular row's data in one sheet as the base for joining data from other sheets on a common join column.
 *
 * @param {Object} config - Configuration object containing all necessary parameters for the query.
 * @param {string} config.sheetId - The unique identifier for the Google Sheets spreadsheet containing the data.
 * @param {Object} config.sheets - An object where each key corresponds to a sheet name within the spreadsheet, and each value is an object with specific configuration for that sheet.
 *   @param {Array<string>} [config.sheets[SheetName].returnColumns] - An optional array specifying the names of the columns to return from the sheet. If omitted, all columns are included.
 *   @param {string} config.sheets[SheetName].joinOn - Specifies the column name used to join data from this sheet with the other sheets.
 *   @param {number} [config.sheets[SheetName].searchIndex] - An optional index specifying the row in the sheet (starting from 0 for the first data row, excluding the header) to use as the base for joining. This parameter should only be present in one sheet's configuration.
 *
 * @returns {Array<Object>} An array containing a single object, where each key is a sheet name and its value is an object representing the joined data from that sheet. The object includes key-value pairs where keys are the column names (with spaces and special characters removed) and values are the corresponding cell values.
 *
 * @example
 * // Example input configuration
 * const queryConfigByIndex = {
 *   sheetId: "1A2B3C4D5E6F7G8H9I0J",
 *   sheets: {
 *     Sheet1: {
 *       returnColumns: ["site id", "Job Code", "Town", "Postcode"],
 *       joinOn: "Job Code",
 *       searchIndex: 2 // Use data from the third row as the base for joining
 *     },
 *     Sheet2: {
 *       returnColumns: ["Client", "Job Code", "Site name", "Current Project Plots"],
 *       joinOn: "Job Code"
 *     },
 *     Sheet3: {
 *       joinOn: "Job Code"
 *     }
 *   }
 * };
 *
 * // Example output
 * [
 *   {
 *     "Sheet1": {
 *       "siteId": "1234",
 *       "JobCode": "J123",
 *       "Town": "Sampletown",
 *       "Postcode": "ST123"
 *     },
 *     "Sheet2": {
 *       "Client": "SampleClient",
 *       "JobCode": "J123",
 *       "SiteName": "Sample Site",
 *       "CurrentProjectPlots": "5"
 *     },
 *     "Sheet3": {
 *       // Data from Sheet3 that matches the JobCode "J123"
 *     }
 *   }
 * ]
 *
 * @description
 * The function operates as follows:
 * 1. Loads all data from each specified sheet, excluding the header row.
 * 2. For the sheet with a defined `searchIndex`, selects the specified row and uses its data as the base for joining.
 * 3. For each of the other sheets, searches for rows where the value in the `joinOn` column matches the corresponding value in the base row.
 * 4. Constructs a result object for each sheet where the join is successful, including only the specified `returnColumns` if provided, or all columns if not.
 * 5. Returns an array containing a single object that aggregates the joined data from all sheets, structured by sheet name.
 */
function querySheetsByIndex(config) {
  const spreadsheet = SpreadsheetApp.openById(config.sheetId);
  const sheetData = {};

  // Load and structure data from each sheet based on the new config structure
  Object.keys(config.sheets).forEach(sheetName => {
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const selectColumns = config.sheets[sheetName].returnColumns || headers; // Select specified columns or all if undefined
    const selectIndices = selectColumns.map(col => headers.indexOf(col));

    sheetData[sheetName] = data.slice(1).map(row => {
      const rowData = {};
      selectIndices.forEach((index, i) => {
        const cellValue = row[index];
        // Include the cell value if the column index is valid
        if (index !== -1) {
          rowData[formatColumnName(selectColumns[i])] = cellValue;
        }
      });
      return rowData;
    });
  });

  // Identify the sheet and row index for the base data
  const baseSheetName = Object.keys(config.sheets).find(sheetName => typeof config.sheets[sheetName].searchIndex !== 'undefined');
  const baseRowIndex = config.sheets[baseSheetName].searchIndex;
  const baseRowData = sheetData[baseSheetName][baseRowIndex];

  // Join data based on 'joinOn' key and base row data
  const joinedData = [];
  const joinValue = baseRowData[formatColumnName(config.sheets[baseSheetName].joinOn)];

  const joinedRow = { [baseSheetName]: baseRowData };

  Object.keys(sheetData).forEach(sheetName => {
    if (sheetName !== baseSheetName) { // Skip the base sheet
      const joinColumn = formatColumnName(config.sheets[sheetName].joinOn);
      const matchingRow = sheetData[sheetName].find(r => r[joinColumn] === joinValue);

      if (matchingRow) {
        joinedRow[sheetName] = matchingRow;
      }
    }
  });

  if (Object.keys(joinedRow).length === Object.keys(config.sheets).length) { // Ensure data from all sheets are present
    joinedData.push(joinedRow);
  }

  return joinedData[0];
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

/**
 * Sanitizes a date field for SQL insertion. Formats a valid date string into SQL date format,
 * or returns null for empty or invalid dates.
 *
 * @param {string} dateString - The date string to be sanitized.
 * @return {string|null} The sanitized date string in 'yyyy-MM-dd' format, or null if input is invalid.
 */
function sanitizeDateForSql(dateInput) {
    let dateString;

    // Check if the input is a Date object or a string
    if (dateInput instanceof Date) {
        // Input is a Date object, convert to string
        dateString = dateInput.toISOString();
    } else if (typeof dateInput === 'string') {
        // Input is a string, use it directly
        dateString = dateInput.trim();
    }

    // Proceed only if dateString is not empty and represents a valid date
    if (dateString && !isNaN(Date.parse(dateString))) {
        try {
            // Attempt to parse the date string and format it
            var date = new Date(dateString);
            if (!isNaN(date.getTime())) { // Check if the date is valid
                // Format the date to SQL date format
                return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd");
            }
        } catch (e) {
            console.error("Error parsing date: " + dateString + " - " + e.message);
        }
    }

    // Return null for invalid or empty date inputs
    return null;
}


// Function to check float values and set them to 0 if they're null
function sanitizeFloat(value) {
    // Check if the value is not null, not an empty string, and is a valid number
    return (value !== null && value !== '' && !isNaN(value)) ? parseFloat(value) : 0;
}

// Function to sanitize Int values, convert them to whole numbers, and set to 0 if invalid
function sanitizeInt(value) {
    // Ensure the value is not null, undefined, an empty string, and is a valid number
    if (value !== null && value !== undefined && value !== '' && !isNaN(parseFloat(value))) {
        return Math.round(parseFloat(value)); // Convert to whole number
    } else {
        return 0; // Return 0 for invalid inputs
    }
}

function convertPhaseToInt(phase) {
    if (phase === "Single Phase" || phase ===  "1") {
        return 1;
    } else if (phase === "Three Phase" || phase === "3") {
        return 3;
    } else {
        return 0; // Default value for any other phase
    }
}

function determineInstallStatus(dateInstall, dateChecked) {
    if (dateInstall && !dateChecked) {
        return '2nd fix';
    } else if (dateInstall && dateChecked) {
        return 'Complete';
    } else {
        return '1st fix';
    }
}

function sanitizeBoolean(value) {
    const trueValues = ['yes', 'true', '1'];
    return trueValues.includes(value.toString().toLowerCase());
}


/**
 * Joins data from multiple sheets in a Google Sheets spreadsheet based on a specified row index
 * from one sheet and corresponding matching data in the other sheets. It also includes data from a
 * special sheet (e.g., "Site Data") for the returned record. This function is designed to use a particular
 * row's data in one sheet as the base for joining data from the other sheets on a common join column.
 *
 * @param {Object} config - Configuration object containing all necessary parameters for the query.
 * @param {string} config.sheetId - The unique identifier for the Google Sheets spreadsheet containing the data.
 * @param {Object} config.sheets - An object where each key corresponds to a sheet name within the spreadsheet,
 *   and each value is an object with specific configuration for that sheet.
 *   @param {Array<string>} [config.sheets[SheetName].returnColumns] - An optional array specifying the names of the
 *     columns to return from the sheet. If omitted, all columns are included.
 *   @param {string} [config.sheets[SheetName].joinOn] - Specifies the column name used to join data from this sheet
 *     with the other sheets. This should be the common join column (e.g., "Plot NO") for all sheets except the special sheet.
 *   @param {number} [config.sheets[SheetName].searchIndex] - An optional index specifying the row in the sheet
 *     (starting from 0 for the first data row, excluding the header) to use as the base for joining. This parameter
 *     should only be present in one sheet's configuration.
 *
 * @returns {Object} An object representing the joined data from the specified row index in the base sheet and the
 *   corresponding matching data from the other sheets. The object includes key-value pairs where keys are the sheet
 *   names (with spaces and special characters removed) and values are objects containing the column names as keys
 *   and the corresponding cell values as values. The special sheet's data is included as a separate key-value pair
 *   in the returned object. If no matching data is found in the other sheets, the `matched` property is set to `false`.
 *
 * @example
 * // Example input configuration
 * const config = {
 *   sheetId: "1A2B3C4D5E6F7G8H9I0J",
 *   sheets: {
 *     "MAP": {
 *       returnColumns: ["PLOT NO", "Elevation No", "Building Side", "kWh/kWp"],
 *       joinOn: "Plot NO",
 *       searchIndex: 3
 *     },
 *     "Total Costing": {
 *       joinOn: "Plot NO"
 *     },
 *     "Site Data": {}
 *   }
 * };
 *
 * // Example output (matched data found)
 * {
 *   "MAP": {
 *     "PLOTNO": "34",
 *     "ElevationNo": "1",
 *     "BuildingSide": "Front",
 *     "kWhkWp": "1032"
 *   },
 *   "Total_Costing": {
 *     "PLOTNO": "34",
 *     "TotalCost": "5000"
 *   },
 *   "Site_Data": {
 *     "Client": "Barratt Homes",
 *     "Jobcode": "BAR-OKE",
 *     "Site_name": "Okement",
 *     "Site_address": "Crediton Road, Okehampton",
 *     "Site_post_code": "EX201XP",
 *     "MCS_Zone": "Zone 4",
 *     "Total_systems": "7",
 *     "Total_Panels": "28",
 *     "Site_kWp": "88.8",
 *     "Site_cotwo": "12248.0512"
 *   },
 *   "matched": true
 * }
 *
 * // Example output (no matching data found)
 * {
 *   "MAP": {
 *     "PLOTNO": "35",
 *     "ElevationNo": "2",
 *     "BuildingSide": "Rear",
 *     "kWhkWp": "950"
 *   },
 *   "Site_Data": {
 *     "Client": "Barratt Homes",
 *     "Jobcode": "BAR-OKE",
 *     "Site_name": "Okement",
 *     "Site_address": "Crediton Road, Okehampton",
 *     "Site_post_code": "EX201XP",
 *     "MCS_Zone": "Zone 4",
 *     "Total_systems": "7",
 *     "Total_Panels": "28",
 *     "Site_kWp": "88.8",
 *     "Site_cotwo": "12248.0512"
 *   },
 *   "matched": false
 * }
 */
function querySheetsByIndexWithSpecialSheet(config) {
  const spreadsheet = SpreadsheetApp.openById(config.sheetId);
  const sheetData = {};

  // Load and structure data from each sheet based on the config
  Object.keys(config.sheets).forEach(sheetName => {
    const formattedSheetName = formatColumnName(sheetName); // Format the sheet name
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const selectColumns = config.sheets[sheetName].returnColumns || headers;
    const selectIndices = selectColumns.map(col => headers.indexOf(col));

    sheetData[formattedSheetName] = data.slice(1).map(row => {
      const rowData = {};
      headers.forEach((header, index) => {
        if (selectIndices.includes(index) || !config.sheets[sheetName].returnColumns) {
          rowData[formatColumnName(header)] = row[index];
        }
      });
      return rowData;
    });
  });

  // Identify the sheet and row index for the base data
  const baseSheetName = Object.keys(config.sheets).find(sheetName => typeof config.sheets[sheetName].searchIndex !== 'undefined');
  const formattedBaseSheetName = formatColumnName(baseSheetName); // Format the base sheet name
  const baseRowIndex = config.sheets[baseSheetName].searchIndex;
  const baseRowData = sheetData[formattedBaseSheetName][baseRowIndex];

  // Join data based on the common join key and base row data
  const joinedData = {};
  const joinKey = baseRowData[formatColumnName(config.sheets[baseSheetName].joinOn)];

  joinedData[formattedBaseSheetName] = baseRowData;

  Object.keys(sheetData).forEach(formattedSheetName => {
    const originalSheetName = Object.keys(config.sheets).find(name => formatColumnName(name) === formattedSheetName);
    if (formattedSheetName !== formattedBaseSheetName && config.sheets[originalSheetName].joinOn) {
      const matchingRow = sheetData[formattedSheetName].find(r => r[formatColumnName(config.sheets[originalSheetName].joinOn)] === joinKey);

      if (matchingRow) {
        joinedData[formattedSheetName] = matchingRow;
        joinedData.matched = true;
      } else {
        joinedData.matched = false;
      }
    } else if (!config.sheets[originalSheetName].joinOn) {
      // Include the special sheet data in the joined data
      joinedData[formattedSheetName] = sheetData[formattedSheetName][0];
    }
  });

  return joinedData;
}
