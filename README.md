# Cerebro Monorepo

100% Type safe content upload platform.
![image](https://github.com/Angael/cerebro/assets/21974933/1c5ad4bb-c6ae-4d36-80b9-b26440d2b002)

## What's inside?

### Apps:

- `web` - Next.js RSC app

  - RSC Next app
  - Mantine for styling
  - React Query

- `server` - Hono backend
  - Authorization
  - Integrates with Cloudflare R2
  - Queries mySQL
  - Handles file uploads with Hono
  - Generates thumbnails
  - Analyzes videos with FFPROBE
  - Compresses images with sharp
  - Compresses videos with FFMPEG
- Packages to share code between repos

### Tech stack

- Bun
- Docker (dev)
- FFmpeg
- FFprobe
- Turborepo
- stripe CLI (dev)
- Cloudflare R2
- mySQL
- nginx

## Development

Installing

```
bun i
```

### Docker compose

To run db, run the following command:

```bash
docker compose up -d
```

It may be necessary to give permissions to docker to access the volume folder.

### Stripe

Download stripe cli to test webhooks locally
https://docs.stripe.com/stripe-cli

In other terminal

```bash
bun dev:stripe
```

###

To run the whole stack run the following command:

```bash
turbo dev
```

## Build

```bash
bun build
```

### Env

Each app contains a `.env.template` file.

This file is changed in CI/CD into `.env` with prod values.

To develop locally, copy `.env.template` into a local `.env` with the correct values.

## Deployment

On push to main, Azure pipelines will build and deploy the apps to Azure App Service.

Fast rollbacks are supported, as last 3 releases are kept.

Database migrations are run by the server on startup.
Is it perfect? No.
Is it good enough? Yes.
