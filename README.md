# Contact Manager

A web app for keeping a personal address book. Users register, sign in, and
create, search, update, and delete their own contacts. Authentication is
handled with server-side PHP sessions, and every endpoint speaks JSON.

## Stack

- **Frontend** — HTML, CSS, and vanilla JavaScript (no build step)
- **Backend** — PHP
- **Database** — MySQL 8.0

## Getting started

1. Create the database and load the sample data by following
   [`sql/README.md`](sql/README.md).
2. Copy the example database config and set the real password:

   ```sh
   cp api/config/database.example.php api/config/database.php
   ```

3. Serve the project root over HTTP with PHP enabled. For a quick local run:

   ```sh
   php -S localhost:8000
   ```

4. Open <http://localhost:8000/> and register an account, or sign in with the
   sample account `demo_user` / `ContactTest123!`.

The front end calls the API through root-relative paths such as
`/api/login.php`, so the project must be served from the document root.

## API

The JSON API is described in [`swagger.yaml`](swagger.yaml). To browse it
interactively, serve the project and open <http://localhost:8000/docs.html>.

## Deployment

Pushing to `main` deploys the application to the server through GitHub Actions
(see [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). That
workflow only syncs code — schema changes must be applied to the server
separately, as described in [`sql/README.md`](sql/README.md).
