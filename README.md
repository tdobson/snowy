# Snowy API

Snowy API is a Node.js-based backend system designed to interact with a MySQL database. It provides a JSON API for various operations, primarily focused on user management, and serves information to a front-end application - called Alcazar 1.0 which is based on  React.

## Overview

The API is built using Express, Sequelize ORM, and MySQL. It adheres to the MVC (Model-View-Controller) architecture, ensuring a clear separation of concerns. The project is structured to be robust, maintainable, and scalable.

## Libraries Used

- **Express**: Web application framework for Node.js, used for routing and middleware.
- **Sequelize**: Promise-based ORM for Node.js, used for database operations.
- **MySQL**: Database system used for data storage.
- **Swagger**: API documentation and exploration tool.
- **Morgan**: HTTP request logger middleware.
- **Helmet**: Middleware for securing HTTP headers.
- **Cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- **Body-parser**: Middleware for parsing incoming request bodies.

## Directory Structure

- `./tests`: Contains test files, such as `users.test.js`, indicating the use of a testing framework like Jest.
- `./routes`: Holds API route definitions. `userRoutes.js` defines routes for user operations, and `index.js` serves as a central router file.
- `./models`: Contains Sequelize models like `user.js`, defining data structures and relationships. `index.js` exports the Sequelize instance.
- `./config`: Configuration files, including `swagger.js` for Swagger setup and `config.json` for database settings.
- `./index.js`: Main application entry point. Sets up middleware, routes, error handling, and server initialization.
- `./import-scripts-app-script`: Google Apps Script files for importing data into the system from external sources.
- `./database`: SQL scripts for database setup, including schema and initial data loading.
- `./middleware`: Custom Express middleware, such as `validation.js`, `errorHandler.js`, and `authentication.js`.
- `./docs`: Contains Swagger documentation in `swagger.yaml`.
- `./utils`: Utility functions and helpers, like `helpers.js`.
- `./controllers`: Controllers like `usersController` that handle the logic for routes.

### Additional Notes on Specific Files

- `./package.json`: Defines project metadata and dependencies.
- `./middleware/validation.js`: Placeholder for request validation logic.
- `./middleware/errorHandler.js`: Centralized error handling middleware.
- `./middleware/authentication.js`: Middleware for handling JWT-based authentication.
- `./utils/helpers.js`: Utility functions for common tasks.
- `./controllers/usersController`: Contains functions for handling user-related routes.

### Import Scripts in `./import-scripts-app-script`

These Google Apps Script files (`import_clients.gs`, `import_dno.gs`, `importRegion.gs`, etc.) are used for importing data from Google Sheets into the Snowy database. They establish database connections, prepare SQL statements, and handle data transformation and insertion. This allows for seamless integration of external data sources into the Snowy system.

## Design Decisions

- **Sequelize ORM**: Facilitates database operations, migrations, and seeders without writing raw SQL. It's also database agnostic.
- **Swagger**: Provides interactive documentation, allowing users to test endpoints directly.
- **Middleware Choices**: Reflects a focus on security (`helmet`), logging (`morgan`), and functionality (`cors`, `body-parser`).
- **Centralized Error Handling**: Ensures uniform error responses.
- **Sequential Database Connection**: Guarantees that the app starts only after a successful database connection.

## Development and Deployment

- Install dependencies: `npm install`
- Start the development server: `npm start`
- Configure MySQL based on `./config/config.json`. Adjust settings for different environments.

## API Documentation

Access the interactive API documentation at `http://localhost:3000/api-docs`.

## Future Improvements

- Integrate JWT or other authentication methods.
- Expand the testing suite with Jest or Mocha.

## Contributing

Contributions are welcome. Please submit issues, fork the repository, and send pull requests.


---

