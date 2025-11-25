# Frontend Tech Challenge – Implementation Notes

- **Server-side search & status filtering**

  - `/api/treatments` supports `search`, `status`, `page`, and `pageSize` query params.
  - `useTreatments` builds the query string from filters + pagination and fetches from the API.
  - Filters and pagination are mirrored into the URL via Next.js router (`router.replace`), so search/status/page can be shared and revisited.

- **Server-side pagination**

  - Backend slices results based on `page` and `pageSize` and returns `total`, `page`, `pageSize`, and `totalPages`.
  - Frontend uses those values for the pagination UI and keeps them in sync with the URL.
  - `PaginationControls` provide first/prev/next/last nav with page indicator.

- \*\*Add Treatment Dialog (Phase 6)

  - Dialog wired with `react-hook-form` + `zod` schema for client-side validation.
  - Submits to `POST /api/treatments` and handles:
    - 422 responses (validation errors) with inline message and error toast.
    - Other failures with friendly error toasts.
  - Successful submissions:
    - Call the `onSubmit` callback so local state is updated.
    - Show a success toast, close the dialog, and reset the form.
  - Submit button is disabled while submitting (shows a loading label).

- **Status update with optimistic UI**

  - Treatment status can be changed via a dropdown in each card.
  - `updateTreatmentStatus` in `useTreatments` performs an optimistic update:
    - Immediately updates the item list in state.
    - Calls `PATCH /api/treatments/:id` with the new status.
    - On failure, rolls back to the previous items and shows an error toast.
    - On success, shows a success toast.

- **UX polish**
  - **Loading skeletons** for the treatments grid using the shared `Skeleton` component.
  - **Error state** using `ErrorState` with a Retry button (full page reload) when the mock API fails.
  - **Empty state** using `EmptyState` with a CTA button to "Clear filters" (reloads page).
  - **Disabled pagination buttons** while loading, via a `disabled` prop on `PaginationControls`.
  - Add status badges with color + human-readable labels (e.g. `in_progress` → "In progress").

## What I would improve next

- **Refine retry behavior**

  - Replace `window.location.reload()` with an internal retry mechanism (e.g. a `reloadKey` in `useTreatments`) so retrying doesn’t reload the whole app.

- **Better error messaging**

  - Surface more specific error messages from the mock API (e.g. 404/500) instead of a single generic message, while still being user-friendly.

- **More granular loading states**

  - Track loading per action (initial load vs. filter change vs. status update) and reflect this in the UI (e.g. a subtle per-card spinner when updating a single item).

- **Form enhancements**

  - Extend the Add Treatment form to support optional `status` and `cost` fields with validation and proper formatting.
  - Consider date pickers and richer validation rules (e.g. date must be today or in the future).

## Libraries used and why

- **Next.js (app router)**

  - Provides file-based routing and serverless API routes (`/api/treatments`) used for server-side filtering and pagination.
  - `usePathname`, `useRouter`, and `useSearchParams` are used to keep UI state and URL in sync.

- **React Hook Form**

  - Lightweight, performant form state management with good TypeScript support.
  - Integrates well with custom field components through `Controller` and context.

- **Zod + @hookform/resolvers**

  - Schema-based validation for the Add Treatment form.
  - Ensures form values are validated consistently on the client, with clear error messages.

## Architecture decisions

- **Context + custom hook for treatments**

  - `TreatmentsProvider` wraps the page and exposes the `useTreatments` hook value via context.
  - Keeps data fetching, filtering, pagination, and optimistic updates in one place while allowing presentational components to stay mostly stateless.

- **URL-driven filters and pagination**

  - Search, status, and pagination are stored in both local state and the URL query string.
  - Enables sharable links, browser navigation support, and server-side filtering via a single source of truth for query params.

- **Server-side filtering and pagination**

  - `/api/treatments` applies search and status filters and paginates before returning data.
  - The frontend does minimal work (sorts only the returned page) and trusts the API for filtering/paging logic.

- **UI composition**
  - Small, focused components (`FiltersSection`, `TreatmentsContent`, `TreatmentsTable`, `TreatmentRow`, `AddTreatmentDialog`) with clearly defined props.
  - Cross-cutting UI pieces like `EmptyState`, `ErrorState`, `Skeleton`, and form components are shared for consistency.
