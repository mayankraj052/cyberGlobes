# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based frontend application for a social media search and mapping service. The app enables users to search and visualize social media data (Twitter/X, Facebook, Instagram, LinkedIn, Google News) on interactive maps with real-time data streaming capabilities.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on local network (--host flag enabled)
npm run dev_docker       # Start dev server for Docker on port 3000

# Building & Preview
npm run build           # Build production version
npm run preview         # Preview production build

# Type Checking & Linting
npm run check           # Run Svelte type checking
npm run check:watch     # Run type checking in watch mode
npm run lint            # Run ESLint and Prettier checks
npm run format          # Auto-format code with Prettier

# Testing
npm run test            # Run all tests (e2e + unit)
npm run test:e2e        # Run Playwright e2e tests
npm run test:unit       # Run Vitest unit tests (watch mode)
npm run test:unit -- --run  # Run unit tests once
```

## Architecture

### Route Structure

The app uses SvelteKit's file-based routing with layout groups:

- **(auth)/** - Authentication pages (login, register, forgot/reset password, email verification)
  - Uses dedicated auth layout without main app sidebar/header
- **(front)/** - Public-facing pages (home, pricing, about, contact, insights, demo)
  - Has its own layout for marketing/public content
- **(customer)/** - Authenticated user pages (dashboard, profile, requests, subscriptions)
  - Uses main app layout with sidebar, header, and footer
- **(fullscreen)/** - Full-screen pages without standard layout (chat, visualization)
  - Minimal layout for immersive experiences

Layout control is managed via `$page.data.layout` prop - set to `false` to disable the standard layout.

### State Management (Svelte Stores)

Located in `src/lib/stores/`:

- **authStore.js** - Authentication state, user data, login/logout functions
  - Uses localStorage for persistence (`AUTH_TOKEN`, `USER_KEY`)
  - Integrates with cookies for server-side access
- **mapStore.ts** - Map-related state (markers, filters, social media data visibility)
  - Manages real-time data updates and marker interactions
- **chatStore.ts** - Chat/conversation state for AI chatbot interface
  - Handles chat history, active chat, and message management
- **themeStore.js** - Dark mode theme state (via mode-watcher)
- **toastStore.js** - Toast notification state

### Services Layer

Service classes in `src/lib/services/` handle all API communication:

- **api-service.js** - Base service with `makeApiCall()` method
  - Handles authentication headers, request types (json/formdata/blob)
  - All other services extend or use this
  - Includes specialized methods like `executeScripter()` and `getScripterStatus()` for AI script execution
- **auth-service.js** - Authentication endpoints (login, register, password reset)
- **user-service.js** - User profile operations
- **request-service.js** - Search request CRUD operations
- **subscription-service.js** - Subscription/payment operations
- **conversation-service.js** - Chat/conversation endpoints for AI chatbot
- **map-service.js** - Map data, geocoding, and location services
- **event-sourcing-service.js** - Server-Sent Events (SSE) for real-time data streaming
  - Listens for social media data events (streetview, x-twitter, facebook, etc.)
  - Handles progressive data loading on maps

### Utilities

Key utilities in `src/lib/utils/`:

- **mapUtils.js** - Map marker creation, clustering, GeoJSON processing (9KB+)
- **socialMediaUtils.js** - Social media data parsing and formatting (12KB+)
- **generalUtils.js** - Common helpers (formatting, validation, etc.)
- **dateTimeUtils.js** - Date/time formatting utilities
- **locationUtils.js** - Geolocation and coordinate helpers

### Components Organization

- **src/lib/components/ui/** - Reusable UI components built with bits-ui and Tailwind
  - Follows shadcn-svelte pattern with separate files per component variant
  - Common components: button, card, dialog, dropdown-menu, alert, badge, etc.
  - Map-specific: MapTopbar, MapFilters, MapExportJson, MapDataInsights
  - Visualization: InstagramStepsSidebar, VisualizationPanel
- **src/lib/components/layout/** - App layout components (Header, Sidebar, Footer)
- **src/lib/components/form/** - Form-specific components
- **src/lib/components/general/** - General-purpose components
- **src/lib/components/charts/** - Chart components using LayerChart library

### Environment Variables

Required in `.env` (see `.env.example`):

```
PUBLIC_API_URL=              # Backend API base URL
PUBLIC_MAPBOX_ACCESS_TOKEN=  # Mapbox API token for maps
PUBLIC_STRIPE_KEY=           # Stripe public key for payments
```

API calls are constructed using `API_BASE_URL` from `src/lib/constants/constants.js` which derives from `PUBLIC_API_URL`.

### Real-time Data Flow

1. User initiates search request via dashboard
2. Backend processes search and returns search ID
3. `event-sourcing-service.js` opens SSE connection to `/map/search-sse/{searchID}`
4. Events stream in (`streetview`, `x-twitter`, `facebook`, etc.) and update `mapStore`
5. Map components reactively update as new data arrives

### Styling

- **Tailwind CSS** with custom design system (see `tailwind.config.ts`)
- Custom color palette with HSL CSS variables for light/dark mode
- Extended colors: primary, secondary, destructive, muted, accent, success, danger, warning, info
- Surface colors for LayerChart: surface-100/200/300
- Dark mode via `mode-watcher` library with class-based switching

### Key Libraries

- **SvelteKit** - Framework (Svelte 5 with runes)
- **bits-ui** - Headless UI components
- **Mapbox GL** - Interactive maps with `@mapbox/mapbox-gl-geocoder`
- **LayerChart** - Data visualization charts
- **Stripe** - Payment processing (`@stripe/stripe-js`, `svelte-stripe`)
- **ApexCharts** - Additional charting
- **Turf.js** - Geospatial analysis
- **Pusher/Laravel Echo** - WebSocket/real-time events
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## Important Patterns

### Authentication Flow

1. User logs in via `AuthService.login()`
2. Token and user data stored in localStorage and cookies via `authStore.login()`
3. `ApiService` reads token from localStorage for all authenticated requests
4. Root layout (`+layout.svelte`) calls `checkAuth()` on mount
5. Unauthenticated users would be redirected to `/login` (currently commented out)

### Page Layout Control

To disable the standard layout (sidebar/header) on a page, set `layout: false` in `+page.ts`:

```javascript
export const load = () => {
  return {
    layout: false
  };
};
```

The root layout checks `$page.data.layout !== false` before rendering the layout wrapper.

### Map Marker Management

Map markers are created dynamically based on social media type. Each type has custom SVG icons defined in `src/lib/constants/constants.js` (e.g., `TwitterIcon`, `FacebookIcon`). The `mapUtils.js` file contains helpers for creating markers, handling clusters, and managing GeoJSON layers.

## Testing

- **Unit tests**: Place `.test.ts` or `.spec.ts` files alongside source in `src/`
- **E2E tests**: Place in `e2e/` directory (Playwright config in `playwright.config.ts`)
- Tests run in CI via `npm run test` which executes both e2e and unit tests

## Deployment

- Uses `@sveltejs/adapter-node` for Node.js deployment
- Build output in `build/` directory after `npm run build`
- Preview production build locally with `npm run preview`
