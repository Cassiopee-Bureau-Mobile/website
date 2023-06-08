# Installation

## Docker

To deploy the application, you need to have docker installed on your machine.

## Requirements

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
$ git clone https://github.com/Cassiopee-Bureau-Mobile/website
$ cd website/docker
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

```bash
$ cd docker
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml build
$ docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Setup the database

```bash
$ docker exec -it cassiopee-frontend bash
$ npm run deploy
```

```bash
$ docker exec -it cassiopee-frontend bash
$ ./node_modules/.bin/ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/prod-seed.ts admin-password-to-change
```

# Debug

## Logs

You can view the logs of ansible inside the `logs` folder.
