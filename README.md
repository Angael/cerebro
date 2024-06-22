# Cerebro Monorepo

100% Type safe content upload platform.
![image](https://github.com/Angael/cerebro/assets/21974933/1c5ad4bb-c6ae-4d36-80b9-b26440d2b002)

## What's inside?

### Apps:
- `web` - Next.js Static export frontend
  - Lightweight static export Next.js app
  - Mantine for styling
  - React Query
  - 
- `server` - Express backend
  - Authorization with Lucia
  - Integrates with Cloudflare R2
  - Queries mySQL
  - Handles file uploads with Multer
  - Generates thumbnails
  - Analyzes videos with FFPROBE
  - Compresses images with sharp
  - Compresses videos with FFMPEG
- Packages to share code between repos

### Tech stack

- Node.js
- Pnpm
- Docker (dev)
- FFmpeg
- FFprobe
- Turborepo
- stripe CLI (dev)
- Cloudflare R2
- mySQL
- nginx

## Development

Download stripe cli to test webhooks locally
https://docs.stripe.com/stripe-cli

To run the whole stack run the following command:
```bash
pnpm i
npx turbo dev
```

In other terminal
```bash
pnpm dev:stripe
```


## Build

```bash
pnpm i
npx turbo build
```

To filter only one app run:
```bash
npx turbo build --filter web
# or
npx turbo build --filter server
```

### Env

Each app contains a `.env.template` file that needs to be changed to `.env` and filled with the correct values.

## Deployment

On push to main, Azure pipelines will build and deploy the apps to Azure App Service.

Fast rollbacks are supported, as last 3 releases are kept.

Database migrations need to be run manually, before the deployment.
