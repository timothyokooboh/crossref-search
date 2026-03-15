# Crossref Metadata Search (Vue + TypeScript)

A search application for exploring the Crossref REST API with search query, facet filtering (type + year), sorting, and pagination. Built for the Crossref take‑home assignment.

## Local Setup

```sh
pnpm install
```

## Run the Dev Server

```sh
pnpm dev
```

## Run Unit Tests

```sh
pnpm test:unit
```

## Run E2E Tests (Playwright)

```sh
# Install browsers the first time
npx playwright install

# Run all e2e tests
pnpm test:e2e

# View the test report
pnpm exec playwright show-report
```

## Notes on Implementation

### Facet UX Tradeoff

The Crossref API returns a reduced facet list when filters are applied (e.g., selecting `Book` returns only that facet). Replacing the entire facet list in the UI causes a jarring experience, because users lose access to other facets without clearing filters.

To improve UX:

- The app **keeps the full facet list** from the last unfiltered query.
- When filters are applied, it **updates counts only for the selected facets**, leaving the rest visible.
- If the **query changes**, facets are **fully replaced** to avoid stale facet lists across searches.

This preserves a stable facet UI while still reflecting the filtered response where it matters most.

### Deep Linking

Search, sort, pagination, and filters sync to the URL using `useRouteQuery`, enabling shareable URLs and refresh persistence.

### Request Cancellation

Requests are cancellable via `AbortController` and cancel errors are ignored, preventing noisy error states.

### HTML Sanitization

Abstracts are rendered using `v-html` but sanitized with DOMPurify before injection to prevent XSS.

## Architecture Highlights

- Centralized query/filter state lives in a Pinia store.
- Facet selection is derived from the `filters` query string for consistency.
- API access is isolated in `services/api.ts` for easier mocking and testing.
