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
4. Initialize the database:
   ```
   npm run db:init
   ```
   This command will create the database schema, tables, indexes, views, and insert initial data.
5. Run the server: `npm start`.
6. Access the API at: `http://localhost:3000/`.
7. Explore the API documentation at: `http://localhost:3000/api-docs`.

## Database Initialization

The database initialization process is handled by the `initializeDatabase` function in `config/initializeDatabase.ts`. This function does the following:

1. Establishes a connection to the database using Sequelize.
2. Executes the following SQL files in order:
   - `install_database.sql`: Creates the database schema and tables.
   - `install_indexes.sql`: Creates indexes for optimized queries.
   - `install_views.sql`: Creates database views.
   - `install_users.sql`: Sets up initial user accounts.
   - `install_data.sql`: Inserts initial data into the tables.

To reinitialize the database, you can run:

```
npm run db:init
```

Note: This process will reset the database to its initial state. Use with caution in a production environment.

## Development Scripts

The project includes several npm scripts to help with development:

- `npm start`: Start the production server.
- `npm run build`: Compile TypeScript files.
- `npm run dev`: Start the development server with hot-reloading.
- `npm test`: Run tests using Jest.
- `npm run lint`: Run ESLint on TypeScript files.
- `npm run lint:fix`: Run ESLint and automatically fix issues.
- `npm run format`: Format code using Prettier.

## Testing

The project uses Jest along with Supertest for testing the backend API.

### Jest

Jest is a delightful JavaScript Testing Framework with a focus on simplicity. It works with projects using: Babel, TypeScript, Node, React, Angular, Vue and more.

### Supertest

Supertest is a library for testing Node.js HTTP servers. It allows you to programmatically send HTTP requests to your application and make assertions about the responses.

### Running Tests

To run the tests, use the following command:

```sh
npm test
```

This command will run all test files with the `.test.ts` extension in the `src` directory and its subdirectories.

### Writing Tests

Tests should be written in TypeScript and placed in the `src/tests` directory. Test files should follow the naming convention `*.test.ts`.

Example test file:

```typescript
import request from 'supertest';
import app from '../app'; // Adjust the import according to your app's entry point

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true);
  });

  it('GET / - should return 200 OK', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});
```

### Test Structure

- `describe` blocks group related tests together.
- `it` blocks define individual test cases.
- Use `expect` to make assertions about the results of your tests.

### Mocking

Jest provides built-in mocking capabilities. You can use `jest.mock()` to mock modules or specific functions.

### Coverage Reports

To generate a coverage report, you can run:

```sh
npm test -- --coverage
```

This will create a `coverage` directory with detailed information about your test coverage.

Feel free to expand upon this setup to include more comprehensive tests for your API endpoints. As your application grows, consider organizing your tests into subdirectories that mirror your source code structure.

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
