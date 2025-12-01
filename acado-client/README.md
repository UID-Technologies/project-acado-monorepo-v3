# Acado.ai

## Prerequisites

- node
- pnpm
- yarn (optional)

## Installation and Run locally

To get started follow this steps:

- Copy `env.example` to `.env` and update the values with your API, Google OAuth, and Firebase credentials.
- Install packages: `npm install`.
- Start the project locally: `npm run dev` (running on port 5173).

## Project Structure

The source code now follows a feature-driven layout inspired by modern enterprise React apps:

- `src/app` – global concerns (`config`, `providers`, `hooks`, `router`, `store`, `types`).
- `src/features` – domain modules (auth, learner dashboards, courses, communities, public pages, media players, etc.).
- `src/components` – shared UI building blocks and design-system primitives.
- `src/layouts` – Pre/Post-login shells, public shells, and additional layout variants.
- `src/services` – infrastructure integrations (`http`, `auth`, `storage`, `analytics`) consumed across features.
- `src/styles` – Tailwind/global CSS entry points.
- `src/assets` & `src/utils` – static assets and pure utility helpers.

## Building Project

To build the app for production run `npm run build`
