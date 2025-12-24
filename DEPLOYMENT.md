
# PocketProof Deployment Guide

## Overview
PocketProof is a Vite-based SPA with a serverless backend for Stripe processing.

## Primary Stack
- **Frontend**: React 18 / Tailwind CSS / Vite
- **AI Engine**: Google Gemini 3 Pro (API-based)
- **Database**: Firebase Firestore
- **Payments**: Stripe Checkout

## Deployment (Vercel)
1. Link repository to Vercel.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variables:
   - `API_KEY`: Gemini API Key
   - `STRIPE_SECRET_KEY`: Stripe Private Key
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase Key
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebase ID

## Health Checks
- Verify HIPAA sanitization by running the `maskPHI` test suite in `integrationService.ts`.
- Ensure `process.env.API_KEY` is not leaked to the client (handled by server-side injection logic).

## Post-Deployment
1. Verify the `/api/create-checkout-session` endpoint returns 200.
2. Check the Audit Command Center (#admin) for initial data population.
