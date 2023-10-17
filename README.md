# Snowy API

Snowy provides a JSON API to interact with a database and serve information to a front-end application using React.

## Overview

This API is built on top of Node.js using Express, Sequelize, and MySQL. It follows a standard MVC pattern with clear separation of concerns, and it is designed to be robust and maintainable.

## Libraries Used

- **Express**: A minimal and flexible Node.js web application framework. Used to build the web server and define API routes.

- **Sequelize**: A promise-based Node.js ORM for SQL databases. Used for defining models, relationships, and performing database operations.

- **MySQL**: The database used to persist the application data.

- **Swagger**: Used for API documentation. It provides an interactive documentation UI for users to explore the API.

- **Morgan**: Logging middleware for request logs.

- **Helmet**: Sets various HTTP headers to make the app more secure.

- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.

- **Body-parser**: Middleware to parse incoming request bodies.

## Directory Structure

- `./tests`: This directory holds the test files. The sample `users.test.js` indicates that Jest or a similar testing framework may be used.

- `./routes`: This is where the API route definitions are kept. The `users.js` file defines routes related to user operations, and the `index.js` is likely a central router file.

- `./models`: Contains Sequelize models. These models define the shape of the data and any relationships. The `user.js` is an example of a User model and the `index.js` sets up and exports the Sequelize instance.

- `./config`: Configuration related files are here. The `swagger.js` is the configuration for the Swagger documentation, and the `config.json` likely contains database connection settings for different environments.

- `./index.js`: The main entry point for the application. It sets up middlewares, routes, error handlers, and starts the server.

## Design Decisions

- **Use of Sequelize**: Sequelize allows for easy database migrations, seeders, and operations without writing raw SQL. It's also database agnostic, meaning we could switch from MySQL to another SQL database with minimal code changes.

- **Swagger for Documentation**: Swagger was chosen because of its interactive UI that allows users to test endpoints directly from the documentation.

- **Middleware Choices**: `helmet` for security, `morgan` for logging, `cors` for cross-origin requests, and `body-parser` to handle request data show a concern for security, user-friendliness, and practical utility.

- **Centralized Error Handling**: The `errorHandler` middleware at the end of `index.js` ensures that all errors are caught and handled uniformly.

- **Database Connection in `index.js`**: The database connection and server start-up are sequential. This ensures that the app doesn't start if there's a problem connecting to the database.

## Development and Deployment

When cloning or downloading the project, make sure to install the required dependencies using:

 npm install

To start the development server:

 npm start

Ensure you have MySQL set up based on the configurations provided in `./config/config.json`. Adjust the settings as necessary to match your local or production environment.

## API Documentation

Once the server is running, you can access the interactive API documentation by navigating to:

http://localhost:3000/api-docs

This provides a comprehensive overview of all available endpoints, their expected inputs, and possible responses.

## Future Improvements:

  -  Integration of JWT (JSON Web Tokens) or other authentication methods to secure the endpoints.
   - Implement a more comprehensive testing suite using libraries like Jest or Mocha.
   - Introduce a caching mechanism, like Redis, for frequently accessed data.

## Contributing:

Please feel free to submit issues, fork the repository and send pull requests!

##License:

This project is licensed under the MIT license.
