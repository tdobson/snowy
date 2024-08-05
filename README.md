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
- **TypeScript**: Static type-checking for JavaScript.
- **ESLint**: Linting utility for JavaScript and TypeScript.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up your MySQL database and update the `./config/config.json` file with your database credentials.
4. Run the server: `npm start`.
5. Access the API at: `http://localhost:3000/`.
6. Explore the API documentation at: `http://localhost:3000/api-docs`.

## Development Scripts

The project includes several npm scripts to help with development:

- `npm start`: Start the production server.
- `npm run build`: Compile TypeScript files.
- `npm run dev`: Start the development server with hot-reloading.
- `npm test`: Run tests (currently not implemented).
- `npm run lint`: Run ESLint on TypeScript files.
- `npm run lint:fix`: Run ESLint and automatically fix issues.
- `npm run format`: Format code using Prettier.

## TypeScript and ESLint Setup

The project is set up with TypeScript and ESLint for static type checking and code linting. The configuration files (`tsconfig.json` and `.eslintrc.js`) are already set up in the project.

To run the TypeScript compiler:

```sh
npm run build
```

To run ESLint:

```sh
npm run lint
```

To automatically fix ESLint issues:

```sh
npm run lint:fix
```

## Prettier Setup

Prettier is configured for code formatting. To format your code:

```sh
npm run format
```

## Husky and lint-staged

The project uses Husky and lint-staged to run linting and formatting on staged files before each commit. This ensures that all committed code meets the project's style guidelines.

## Converting JavaScript to TypeScript

If you need to convert existing JavaScript files to TypeScript:

1. Rename the file from `.js` to `.ts`.
2. Update imports/exports to use ES6 module syntax.
3. Add type annotations where necessary.
4. Run `npm run build` to check for any TypeScript errors.
5. Fix any type errors that the compiler identifies.

Remember to update any import statements in other files that reference the newly converted TypeScript file.

## Directory Structure

- `./src`: TypeScript source files.
- `./dist`: Compiled JavaScript files.
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
