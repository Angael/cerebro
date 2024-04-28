# Cerebro Monorepo

100% Type safe monorepo.

## What's inside?

Apps:
- `web` - Next.js Static export frontend
- `server` - Express backend

And packages to simplify sharing variables and types.

### Dependancies

- Node.js
- Pnpm
- Docker (dev)
- FFmpeg
- FFprobe
- Turborepo
- stripe CLI (dev)

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