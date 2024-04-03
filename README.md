# Cerebro Monorepo

100% Type safe monorepo.

## What's inside?

Apps:
- `web` - Next.js Static export frontend
- `server` - Express backend

And packages to simplify sharing variables and types.

## Dependancies

- Node.js
- Pnpm
- Docker
- FFmpeg
- FFprobe

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

## Develop

To run the whole stack run the following command:
```bash
pnpm i
npx turbo dev
```

## Env

Each app contains a `.env.template` file that needs to be changed to `.env` and filled with the correct values.