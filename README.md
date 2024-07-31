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

## TypeScript and ESLint Setup

To set up TypeScript and ESLint in your project, follow these steps:

1. **Initialize TypeScript Configuration**:
   ```sh
   npx tsc --init
   ```

2. **Install TypeScript and ESLint Dependencies**:
   ```sh
   npm install --save-dev typescript @types/node eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

3. **Configure ESLint**:
   Create an `.eslintrc.js` file with the following content:
   ```javascript
   module.exports = {
     parser: '@typescript-eslint/parser',
     extends: [
       'plugin:@typescript-eslint/recommended',
     ],
     parserOptions: {
       ecmaVersion: 2018,
       sourceType: 'module',
     },
     rules: {
       // Add custom rules here
     },
   };
   ```

4. **Update `tsconfig.json`**:
   Ensure your `tsconfig.json` file is configured correctly, as shown in the example above.

5. **Compile TypeScript**:
   To compile your TypeScript code, run:
   ```sh
   npx tsc
   ```

6. **Run ESLint**:
   To lint your TypeScript code, run:
   ```sh
   npx eslint . --ext .ts,.js
   ```

By following these steps, you will have TypeScript and ESLint set up in your project, enabling you to gradually convert your codebase to TypeScript while maintaining code quality with ESLint.

### Converting the Project to TypeScript

To convert the project to TypeScript, follow these steps:

1. **Rename JavaScript Files**:
   Rename your JavaScript files (e.g., `index.js`, `app.js`) to TypeScript files (e.g., `index.ts`, `app.ts`).

2. **Add TypeScript Definitions**:
   Add TypeScript definitions for your dependencies. You can use `@types` packages for many popular libraries.

3. **Update Imports**:
   Update your import statements to use TypeScript's module resolution.

4. **Add Type Annotations**:
   Add type annotations to your functions, variables, and classes.

5. **Compile and Test**:
   Compile your TypeScript code using `npx tsc` and test your application to ensure everything works correctly.

By following these steps, you can gradually convert your project to TypeScript while ensuring that your code remains functional and maintainable.

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
