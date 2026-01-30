# Cloudwings technology Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

## Overview

A modern Angular application for blogger platform with user authentication features including signup and login functionality. The application is configured for DevOps deployment with Docker and CI/CD pipeline.

## Features

- **User Authentication**: Complete signup and login functionality
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Form Validation**: Client-side validation with error handling
- **API Integration**: Connected to backend API at `http://10.57.88.165:3000`
- **DevOps Ready**: Docker containerization and CI/CD pipeline

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## API Configuration

The application is configured to connect to the backend API at `http://10.57.88.165:3000`. 

Available endpoints:
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication  
- `GET /user` - Get user profile (requires authentication)

## Docker Deployment

### Build and run with Docker

```bash
# Build the Docker image
docker build -t blogger-frontend .

# Run the container
docker run -p 80:80 blogger-frontend
```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow for automated testing and deployment:

- **Test**: Runs unit tests and builds the application
- **Build**: Creates Docker image and pushes to registry
- **Deploy**: Deploys to production server

### Required GitHub Secrets

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token
- `PROD_HOST`: Production server hostname
- `PROD_USER`: Production server username
- `PROD_SSH_KEY`: Production server SSH private key

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── signup/          # User registration component
│   │   ├── login/           # User login component
│   │   └── dashboard/       # User dashboard component
│   ├── services/
│   │   └── auth.service.ts  # Authentication service
│   ├── app.routes.ts        # Application routing
│   ├── app.config.ts        # Application configuration
│   └── app.component.ts     # Root component
└── ...
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
