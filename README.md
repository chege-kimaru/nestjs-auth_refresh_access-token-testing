# FRETERIUM API V3

## Development Setup and Guide
- Always ensure your `.env` file has all config keys in `sample.env`.
- ### Migrations
  - To create a migration file 
  ```
  npm run migration:create src/typeorm/migrations/[MigrationName]
  ```
  - To run a migration
  ```
  npm run migration:run
  ```
  - To revert a migration
  ```
  npm run migration:revert
  ```
- ### Docker
  - To start the application:
  ```
  docker-compose up 

  # or if you need to update node_modules:

  docker-compose up --build -V 
  ```

  - **Note**: Building the container will not run any pending migrations. To run any pending migration:
  ```
  npm run migration:run
  ```

## Basic Nestjs Commands
### Installation
- **Note**: To speed up packages installation, especially on docker with node:16, we are using **pnpm** instead of **npm**
- Install single package
```bash
$ pnpm add pkg
```
- Install packages
```bash
$ pnpm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

- **Note:** To run tests locally that is outside docker container, change your `DB_HOST` env variable to `localhost`. Eg on Unix:
```
DB_HOST=localhost npm run test
```
