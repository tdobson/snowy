# Snowy API

Snowy API is a comprehensive backend system designed for managing solar panel installations and related processes. It is built on Node.js and interacts with a MySQL database, providing a JSON API for various operations. The system is primarily focused on user management, project tracking, and integration with external data sources like Google Sheets.

## Features

- **User Management**: Create, read, update, and delete user information. Includes authentication and password reset functionalities.
- **Project Management**: Manage solar panel installation projects, including details like client information, site data, and project status.
- **Data Import**: Import data from Google Sheets into the Snowy database, facilitating seamless integration of external data sources.
- **Authentication**: Secure routes with JWT-based authentication middleware.
- **Error Handling**: Centralized error handling for consistent API responses.
- **API Documentation**: Interactive API documentation using Swagger.

## Technologies

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js, used for routing and middleware.
- **Sequelize**: Promise-based ORM for Node.js, used for database operations.
- **MySQL**: Database system used for data storage.
- **Swagger**: API documentation and exploration tool.
- **JWT (JSON Web Tokens)**: Used for secure authentication.
- **Bcryptjs**: Library for hashing and comparing passwords.
- **Nodemailer**: (Not visible installed yet) for sending emails, like password reset emails.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your MySQL database and update the `./config/config.json` file with your database credentials.
4. Run the server: `npm start`.
5. Access the API at: `http://localhost:3000/`.
6. Explore the API documentation at: `http://localhost:3000/api-docs`.

## Directory Structure

- `./models`: Sequelize models for database tables.
- `./routes`: Express routes for handling API requests.
- `./controllers`: Controllers to handle the logic for each route.
- `./middleware`: Custom Express middleware, including authentication and error handling.
- `./utils`: Utility functions, including helpers for hashing passwords and managing import events.
- `./import-scripts-app-script`: Google Apps Script files for importing data.
- `./docs`: Swagger API documentation.
- `./config`: Configuration files, including database and Swagger setup.

## API Endpoints

- **User Routes**: `/users` for managing users.
- **Project Routes**: `/projects` for managing projects.
- **Authentication Routes**: `/auth` for user authentication.

## Future Enhancements

- Expand testing suite for robustness.
- Implement rate limiting and additional security checks.
- Explore integration with additional external services.

## Contributing

Contributions to the Snowy API are welcome. Please follow the standard fork-and-pull request workflow.

## License

This project is all rights reserved.
