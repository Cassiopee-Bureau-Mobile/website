# Installation

## Requirements

### Software

- [Docker](https://docs.docker.com/engine/install/)
- Git
- Python3

### Email

To send emails, you need to have a gmail account well configured.

- You need to have a gmail account with a email as `EMAIL_USER` in the .env file.
- Create a gmail project on the [google cloud platform](https://console.cloud.google.com/).
  - You can follow this [tutorial](https://docs.emailengine.app/setting-up-gmail-oauth2-for-imap-api) to configure your gmail account up to the part where I goes to the _Email Engine_ website.
  - Details:
    - You need to create a project on the [google cloud platform](https://console.cloud.google.com/).
    - Go to APIs & Services > Credentials. (You will need to create a project if you don't have one)
    - Then, you need to create an OAuth 2.0 Client ID.
    - Get your Client ID, `EMAIL_CLIENT_ID` in the .env file.
    - Get your Client Secret, `EMAIL_CLIENT_SECRET` in the .env file.
- You need to get an app password.
  - For this, you need to go to your [google account settings](https://myaccount.google.com/).
  - Then, you need to go to the security tab.
  - Activate the two-step verification.
  - You need to go to the [app password section](https://myaccount.google.com/apppasswords).
  - You need to generate a password for the app. (Select other and give it a name), will be used as `EMAIL_PASSWORD` in the .env file.

## Configuration

```bash
$ git clone https://github.com/Cassiopee-Bureau-Mobile/website --recurse-submodules
```

Then you need to update the ansible submodule to the latest version.

```bash
$ cd website
$ git submodule update --remote --merge
```

Then you need to create a .env file in the docker folder.

```bash
$ cd docker
$ nano .env
```

You need to fill the .env file with the following information:

```
#Secrets
POSTGRES_PASSWORD=your_password (you can generate it with openssl rand -hex 32)
NEXTAUTH_SECRET=your_secret (you can generate it with openssl rand -hex 32)

# SSL
HOST=example.com

# Email
EMAIL_USER=
EMAIL_CLIENT_ID=
EMAIL_CLIENT_SECRET=
EMAIL_PASSWORD=
```

## SSL

You will need to have a SSL certificate to deploy the application.
You need to generate a certificate and a key and put them in the `docker/ssl` folder, with the name:

- example.crt
- example.key

## Deploy

Try those with sudo if you got a permission error.

```bash
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml build
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Setup the database

Try those with sudo if you got a permission error, especially for the `docker exec` commands.

```bash
$ docker exec -it cassiopee-frontend /bin/sh
$ npm run deploy
$ ./node_modules/.bin/ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/prod-seed.ts admin-password-to-change
```

The first command will open a shell inside the container.
The second command will deploy the database.
The third command will seed the database with the admin user. **You need to change the password**.

# Debug

## Logs

You can view the logs of ansible inside the `logs` folder.

# Development

## Requirements

### Software

- [Docker](https://docs.docker.com/engine/install/)
- Ansible

## Configuration

```bash
$ git clone https://github.com/Cassiopee-Bureau-Mobile/website --recurse-submodules
```

Then you need to update the ansible submodule to the latest version.

```bash
$ cd website
$ git submodule update --remote --merge
```

Then you need to create a .env file in the docker folder and in the frontend folder.

```bash
$ cd docker
$ nano .env
```

You need to fill the .env file with the following information:

```
#Secrets
POSTGRES_PASSWORD=your_password (you can generate it with openssl rand -hex 32)
NEXTAUTH_SECRET=your_secret (you can generate it with openssl rand -hex 32)
```

If you want you can add the following information:

```
# Email
EMAIL_USER=
EMAIL_CLIENT_ID=
EMAIL_CLIENT_SECRET=
EMAIL_PASSWORD=
```

But it's not necessary, you will be juste be warn that you can't send email and the email will be saved in the logs folder under the folder `email`.

## SSL

You will need to follow the instrcutions inside [Readme-SSL](docker/reverse-proxy/ssl/README.md) to setup your computer to use own signed certificates.

## Start the development environment

You can start the development environment with the following command:

```bash
$ ./DeployDocker.sh
```

In case you need to reset the database, simply do :

```bash
$ cd frontend
$ npm run reset-db
```

To monitor the database, you can use the following command:

```bash
$ cd frontend
$ npx prisma studio
```

Follow [Readme-Frontend](frontend/README.md) to have more information about the frontend.

## Test the application

Only a few tests have been written for the moment, but you can run them with the following command:

```bash
$ cd frontend
$ npm run test
```

## Code quality

You can run the linter with the following command:

```bash
$ cd frontend
$ npm run lint
```

You can run the formatter with the following command:

```bash
$ cd frontend
$ npm run format
```
