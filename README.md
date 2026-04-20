# Cyber Buddha Blessing Web App

This is a Next.js 14 application for the Cyber Buddha Blessing service.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

```bash
npm run build
```

## Deploy

This project is deployed on Vercel. Make sure to set the Root Directory to `cyber-buddha-blessing` in your Vercel project settings.

### Deployment Notes
- Static images are stored in the `public/temple-images/` directory
- .vercelignore has been updated to include image files
- Vercel deployment should automatically include all static images
- Multi-service deployment is configured in vercel.json
