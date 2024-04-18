/**
 * Synchronizes plot data from a MySQL database to a Google Spreadsheet.
 * Retrieves data from the 'sn_vw_plot_elevation_details_for_tracker' view and updates or adds plots in the 'Plots' sheet.
 *
 * The function performs the following steps:
 * 1. Establishes a connection to the MySQL database using the provided connection details.
 * 2. Executes a query to retrieve data from the 'sn_vw_plot_elevation_details_for_tracker' view.
 * 3. Retrieves the column names from the result set metadata.
 * 4. Iterates over each row in the result set.
 *    - Maps the column names to the corresponding values in each row, creating a 'plotInfo' object.
 *    - Checks if a plot with the same 'Plot Number', 'Project Number', and 'Elevation No' exists in the 'Plots' sheet.
 *      - If an existing plot is found, updates the plot with missing details from the 'plotInfo' object.
 *      - If no existing plot is found, adds a new plot using the 'plotInfo' object.
 * 5. Catches any errors that occur during the execution of the query and logs them to the console.
 * 6. Closes the database connection.
 *
 * The function relies on the following helper functions:
 * - `getExistingPlot`: Retrieves an existing plot from the 'Plots' sheet based on the provided 'Plot Number', 'Project Number', and 'Elevation No'.
 * - `updatePlot`: Updates an existing plot with missing details from the 'plotInfo' object.
 * - `addPlot`: Adds a new plot to the 'Plots' sheet using the 'plotInfo' object.
 *
 * Note: The function assumes the existence of certain global variables (GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD)
 * for establishing the database connection.
 *
 * @function
 * @name syncPlotsFromDatabase
 * @returns {void}
 * @throws {Error} If an error occurs during the execution of the database query.
 *
 * @see {@link getExistingPlot}
 * @see {@link updatePlot}
 * @see {@link addPlot}
 */
function syncPlotsFromDatabase() {
    // Establish a connection to the MySQL database
    var conn = Jdbc.getConnection(GLOBAL_DB_URL, GLOBAL_DB_USER, GLOBAL_DB_PASSWORD);

    try {
        // Create a statement
        var stmt = conn.createStatement();

        // Execute the query to retrieve data from the view
        var results = stmt.executeQuery('SELECT * FROM sn_vw_plot_elevation_details_for_tracker LIMIT 10');

        // Get the metadata to retrieve column names
        var metaData = results.getMetaData();
        var columnCount = metaData.getColumnCount();
        var columnNames = [];

        // Store the column names in an array
        for (var i = 1; i <= columnCount; i++) {
            columnNames.push(metaData.getColumnName(i));
        }

        // Iterate over the result set
        while (results.next()) {
            var plotInfo = {};

            // Map the column names to the plotInfo object
            for (var i = 0; i < columnCount; i++) {
                var columnName = columnNames[i];
                var value = results.getString(columnName);
                plotInfo[columnName] = value;
            }

            // Check if a plot with the same Plot Number, Project Number, and Elevation No exists
            var existingPlot = getExistingPlot(plotInfo['PLOT NO'], plotInfo['projectNo'], plotInfo['Elevation_No']);

            if (existingPlot) {
                // Update the existing plot with missing details
                updatePlot(existingPlot, plotInfo);
            } else {
                // Add a new plot
                addPlot(plotInfo);
            }

            // Call the syncProjectFromDatabase function for each new plot
            syncProjectFromDatabase(conn,plotInfo['projectNo']);
        }
    } catch (err) {
        console.error('Error executing query: ' + err.message);
    } finally {
        // Close the connection
        conn.close();
    }
}

/**
 * Retrieves an existing plot from the 'Plots' sheet based on the provided plot number, project number, and elevation number.
 *
 * @function
 * @name getExistingPlot
 *
 * @param {string} plotNumber - The plot number to search for.
 * @param {string} projectNumber - The project number associated with the plot.
 * @param {string} elevationNo - The elevation number of the plot.
 *
 * @returns {Object|null} An object representing the existing plot if found, or null if no matching plot is found.
 *   The returned object has the following properties:
 *   - plotInfo: An array containing the values of the existing plot.
 *   - rowIndex: The row index of the existing plot in the 'Plots' sheet.
 *
 * @description
 * This function searches for an existing plot in the 'Plots' sheet of the active Google Spreadsheet.
 * It uses the provided `plotNumber`, `projectNumber`, and `elevationNo` to find a matching plot.
 *
 * The function performs the following steps:
 * 1. Retrieves the ID of the active Google Spreadsheet.
 * 2. Defines the name of the sheet to search in ('Plots').
 * 3. Defines the column names to search for the plot number, project number, and elevation number.
 * 4. Defines the column name to return the plot ID.
 * 5. Calls the `findValueInSheetWithThreeCriteria` function to search for a matching plot based on the provided criteria.
 *    - If a matching plot is found, the function returns an object containing the plot information and row index.
 *    - If no matching plot is found, the function returns null.
 *
 * The function relies on the following helper functions:
 * - `findValueInSheetWithThreeCriteria`: Searches for a value in the specified sheet based on three search criteria.
 * - `getPlotById`: Retrieves a plot from the 'Plots' sheet based on the provided plot ID.
 *
 * @example
 * const existingPlot = getExistingPlot('1A', 'PRJ001', 'EL001');
 * if (existingPlot) {
 *   console.log('Existing plot found:', existingPlot);
 * } else {
 *   console.log('No existing plot found.');
 * }
 *
 * @see {@link findValueInSheetWithThreeCriteria}
 * @see {@link getPlotById}
 */
function getExistingPlot(plotNumber, projectNumber, elevationNo) {
    const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
    const sheetName = "Plots";
    const plotSearchColumn = "PLOT NO";
    const projectSearchColumn = "Job Code";
    const elevationSearchColumn = "Elevation Number";
    const returnColumnName = "plot id";

    const existingPlotId = findValueInSheetWithThreeCriteria(
        spreadsheetId,
        sheetName,
        plotSearchColumn,
        projectSearchColumn,
        elevationSearchColumn,
        returnColumnName,
        plotNumber,
        projectNumber,
        elevationNo
    );

    if (existingPlotId) {
        return getPlotById(existingPlotId);
    }

    return null;
}

/**
 * Updates an existing plot in the 'Plots' sheet with missing details from the provided plot information.
 *
 * @function
 * @name updatePlot
 *
 * @param {Object} existingPlot - An object representing the existing plot to be updated.
 *   The object should have the following properties:
 *   - plotInfo: An array containing the existing plot information.
 *   - rowIndex: The row index of the existing plot in the 'Plots' sheet.
 * @param {Object} newPlotInfo - An object containing the new plot information to update the existing plot with.
 *   The object should have properties corresponding to the column names in the 'Plots' sheet, with spaces and special characters replaced by underscores.
 *
 * @returns {void}
 *
 * @description
 * This function updates an existing plot in the 'Plots' sheet with missing details from the provided `newPlotInfo` object.
 * It checks the values in the "1st fix complete" and "2nd Fix Complete" columns:
 * - If neither column has any records, it updates the address and MPAN columns with the corresponding values from `newPlotInfo`.
 * - If there are no records in either column, it overwrites the entire row with the values from `newPlotInfo` that match the column names.
 *
 * The function performs the following steps:
 * 1. Retrieves the 'Plots' sheet from the active Google Spreadsheet.
 * 2. Extracts the row index of the existing plot from the `existingPlot` object.
 * 3. Retrieves the existing plot information from the `existingPlot` object.
 * 4. Retrieves the column indexes for "1st fix complete", "2nd Fix Complete", and the address and MPAN columns.
 * 5. Creates a mapping object to map the property names in `newPlotInfo` to the corresponding column names in the sheet.
 * 6. Checks the values in the "1st fix complete" and "2nd Fix Complete" columns:
 *    - If neither column has any records, updates the address and MPAN columns with the corresponding values from `newPlotInfo`.
 *    - If there are no records in either column, overwrites the entire row with the values from `newPlotInfo` that match the column names.
 *
 * Note: The function assumes that the `newPlotInfo` object has properties corresponding to the column names in the 'Plots' sheet, with spaces and special characters replaced by underscores.
 *
 * @example
 * const existingPlot = {
 *   plotInfo: ['1A', 'PRJ001', 'Site A', '', ''],
 *   rowIndex: 2
 * };
 * const newPlotInfo = {
 *   'Plot_NO': '1A',
 *   'projectNo': 'PRJ001',
 *   'Site': 'Site A',
 *   'Elevation_No': 'EL001',
 *   'MPAN': '1234567890',
 *   'House_No_name': '123',
 *   'Street': 'Example Street',
 *   'Town': 'Example Town',
 *   'Postcode': 'ABC 123'
 * };
 * updatePlot(existingPlot, newPlotInfo);
 */
function updatePlot(existingPlot, newPlotInfo) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Plots");
    var rowIndex = existingPlot.rowIndex;
    var existingPlotInfo = existingPlot.plotInfo;

    // Get the column indexes for "1st fix complete", "2nd Fix Complete", and the address and MPAN columns
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var firstFixIndex = headers.indexOf("1st fix complete");
    var secondFixIndex = headers.indexOf("2nd Fix Complete");

    // Create a mapping object to map the property names in newPlotInfo to the corresponding column names in the sheet
    var columnMapping = {
        'House_No_name': 'House No/name',
        'Street': 'Street',
        'Town': 'Town',
        'Postcode': 'Postcode',
        'MPAN': 'MPAN'
    };

    // Check if neither "1st fix complete" nor "2nd Fix Complete" has any records
    if (!existingPlotInfo[firstFixIndex] && !existingPlotInfo[secondFixIndex]) {
        // Update the address and MPAN columns with the corresponding values from newPlotInfo
        for (var key in columnMapping) {
            if (newPlotInfo.hasOwnProperty(key)) {
                var columnIndex = headers.indexOf(columnMapping[key]);
                if (columnIndex !== -1) {
                    sheet.getRange(rowIndex, columnIndex + 1).setValue(newPlotInfo[key]);
                }
            }
        }
    } else {
        // Overwrite the entire row with the values from newPlotInfo that match the column names
        for (var i = 0; i < headers.length; i++) {
            var columnName = headers[i];
            var propertyName = columnName.replace(/[^a-zA-Z0-9]/g, '_');
            if (newPlotInfo.hasOwnProperty(propertyName)) {
                sheet.getRange(rowIndex, i + 1).setValue(newPlotInfo[propertyName]);
            }
        }
    }
}

/**
 * Synchronizes project data from the 'Tracker' sheet and the MySQL database.
 * If the project exists in the 'Tracker' sheet, returns the value from the first column of the existing project row.
 * If the project doesn't exist, retrieves project details from the 'sn_vw_projects_for_tracker' view in the database,
 * adds the project to the 'Tracker' sheet using the `addProject` function, and returns the value returned by `addProject`.
 *
 * @function
 * @name syncProjectFromDatabase
 *
 * @param {string} projectNumber - The project number to search for in the 'Tracker' sheet and the database.
 *
 * @returns {string|null} - The value from the first column of the existing project row if the project exists,
 *                          or the value returned by `addProject` if a new project is added,
 *                          or `null` if no project is found and `addProject` is not called.
 *
 * @description
 * The `syncProjectFromDatabase` function performs the following steps:
 * 1. Retrieves the existing project data from the 'Tracker' sheet using the `getDataForSearchPJ` function.
 * 2. Searches for a project row where the project number (assumed to be in the third column, index 2) matches the provided `projectNumber`.
 * 3. If a matching project is found:
 *    - Returns the value from the first column (index 0) of the existing project row.
 * 4. If no matching project is found:
 *    - Establishes a connection to the MySQL database using the provided connection details.
 *    - Executes a query to retrieve project details from the 'sn_vw_projects_for_tracker' view, filtering the results based on the `projectNumber`.
 *    - If the query returns a result:
 *      - Maps the column names to their corresponding values, creating a `projectInfo` object.
 *      - Calls the `addProject` function, passing the `projectInfo` object to add the project to the 'Tracker' sheet.
 *      - Captures the return value of `addProject` in a variable called `newProjectId`.
 *      - Closes the database connection and result set.
 *      - Returns the `newProjectId` value.
 *    - If the query does not return a result:
 *      - Closes the database connection and result set.
 *      - Returns `null`.
 *
 * Note: The function assumes the existence of the following:
 * - The `getDataForSearchPJ` function to retrieve existing project data from the 'Tracker' sheet.
 * - The `addProject` function to add a new project to the 'Tracker' sheet.
 * - The `GLOBAL_DB_URL`, `GLOBAL_DB_USER`, and `GLOBAL_DB_PASSWORD` variables for establishing the MySQL database connection.
 *
 * @throws {Error} - If an error occurs during the database connection or query execution.
 *
 * @example
 * // Call the function with a project number
 * var result = syncProjectFromDatabase('ABC123');
 * if (result) {
 *   console.log('Project synchronized. Result:', result);
 * } else {
 *   console.log('Project not found.');
 * }
 */
function syncProjectFromDatabase(conn, projectNumber) {
    // Check if the project already exists in the 'Tracker' sheet
    var projectData = getDataForSearchPJ();
    var existingProject = projectData.find(function(row) {
        return row[2] === projectNumber; // Assuming project number is in the 3rd column (index 2)
    });

    if (existingProject) {
        // Project exists, return the first column value from the existing project row
        return existingProject[0];
    } else {
        // Project doesn't exist, retrieve project details from the database
        var stmt = conn.createStatement();
        var query = 'SELECT * FROM sn_vw_project_info_for_tracker WHERE projectNo = "' + projectNumber + '"';
        var results = stmt.executeQuery(query);

        if (results.next()) {
            var projectInfo = {};
            var metaData = results.getMetaData();
            var columnCount = metaData.getColumnCount();

            for (var i = 1; i <= columnCount; i++) {
                var columnName = metaData.getColumnName(i);
                var value = results.getString(columnName);
                projectInfo[columnName] = value;
            }

            /*  * addProject({
             *   projectNo: "P123",
             *   site: "Example Site",
             *   clientName: "Example Client",
             *   siteAddress: "123 Example Street",
             *   sitePostcode: "AB12 3CD",
             *   sitew3w: "what3words.example",
             *   surveyorName: "John Doe",
             *   surveyorTel: "01234 567890",
             *   surveyorEmail: "john.doe@example.com",
             *   siteAgentName: "Jane Smith",
             *   siteAgentTel: "09876 543210",
             *   siteAgentEmail: "jane.smith@example.com"
             * });
             * */
            // Add the project to the 'Tracker' sheet using the addProject function
            var newProjectId = addProject(projectInfo);


            // Return the value returned by addProject
            return newProjectId;
        }



        // Return null if no project is found and addProject is not called
        return null;
    }
}

/**
 * Searches for values in specified columns and returns a corresponding value from another column.
 * All three search criteria must match for the function to return the value from the return column.
 * If goneAheadSearchColumn is null or undefined, it matches a goneAheadValue of 1.
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
function findValueInSheetWithThreeCriteriaWithBooleanMatch(spreadsheetId, sheetName, plotSearchColumn, projectSearchColumn, goneAheadSearchColumn, returnColumnName, plotValue, projectValue, goneAheadValue) {
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

    if (plotSearchIndex === -1 || projectSearchIndex === -1 || returnColIndex === -1) {
        throw new Error('One or more columns not found.');
    }

    // Search for the values in the specified columns
    for (var row = 1; row < data.length; row++) {
        var plotMatch = data[row][plotSearchIndex].toString() === plotValue.toString();
        var projectMatch = data[row][projectSearchIndex].toString().replace(/^0+/, '') === projectValue.replace(/^0+/, '');
        var goneAheadMatch = true;

        if (goneAheadSearchIndex !== -1) {
            var goneAheadValue = data[row][goneAheadSearchIndex];
            goneAheadMatch = (goneAheadValue !== null && goneAheadValue !== undefined) ? goneAheadValue.toString() === "1" : true;
        }

        console.log(`Row ${row}: Plot match: ${plotMatch}, Project match: ${projectMatch}, GoneAhead match: ${goneAheadMatch}`);

        if (plotMatch && projectMatch && goneAheadMatch) {
            console.log(`Match found at row ${row}, returning value from column ${returnColIndex}`);
            return data[row][returnColIndex].toString();
        }
    }

    console.log('No match found');
    return null; // Return null if no match is found
}
