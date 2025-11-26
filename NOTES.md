# Frontend Tech Challenge – Implementation Notes

## Summary

This project is built with Next.js, TypeScript, and Tailwind CSS. The implementation focuses on clean architecture, excellent UX, accessibility, and maintainable code. Key achievements include modular hook architecture, server-side filtering/pagination, optimistic UI updates, comprehensive accessibility, and full internationalization support.

## Features

- ✅ **Server-side filtering, searching, and pagination** with URL synchronization
- ✅ **Optimistic UI updates** with automatic rollback on failure
- ✅ **Multi-select status filtering** with flexible querying
- ✅ **Add treatment dialog** with form validation and error handling
- ✅ **Internationalization** (i18n) - English, French, German
- ✅ **Full accessibility (a11y)** - WCAG compliant with ARIA labels, keyboard navigation
- ✅ **Type-safe codebase** - No `any` types, strict TypeScript
- ✅ **Loading states** - Skeleton loaders, per-item loading indicators
- ✅ **Error handling** - Toast notifications, retry mechanisms, user-friendly messages
- ✅ **Git hooks** - Pre-commit linting, pre-push testing
- ✅ **CI/CD pipeline** - Automated lint, test, and build

## Key Highlights

### Architecture & Code Organization
- **Modular Hook Architecture**: Extracted the monolithic `useTreatments` hook into focused, single-responsibility sub-hooks (`useUrlSync`, `useFetchTreatments`, `useFilters`, `useTreatmentActions`) for better testability and maintainability.
- **Component Refactoring**: Refactored `AddTreatmentDialog` to use reusable form components and extracted all business logic into a custom hook (`useAddTreatmentForm`) and API service layer.
- **Clean Separation**: Data fetching, state management, filtering, and UI are well-separated with clear interfaces.
- **URL-Driven State**: All filters and pagination are synchronized with URL query parameters, enabling shareable links and proper browser navigation.

### Technical Implementation
- **Server-Side Architecture**: All filtering, searching, and pagination happens server-side via API, ensuring scalability and data consistency.
- **Optimistic UI Updates**: Status updates use optimistic updates with automatic rollback on failure, providing instant feedback while handling errors gracefully.
- **Request Cancellation**: Implemented proper request cancellation to prevent race conditions when filters change rapidly.
- **Type Safety**: Removed all `any` types, added explicit type annotations throughout, ensuring strict TypeScript compliance.

### UX Excellence
- **Loading States**: Skeleton loaders prevent content flash, with loading states tracked per-treatment for status updates.
- **Error Handling**: Comprehensive error states with retry mechanisms and user-friendly toast notifications (Sonner) with custom styling.
- **Debounced Search**: Implemented debounced search input (300ms) to reduce API calls while maintaining responsive feel.
- **Multi-Select Filters**: Status filter supports selecting multiple values simultaneously for flexible querying.

### Accessibility (a11y)
- **WCAG Compliance**: Comprehensive ARIA labels, roles, and live regions throughout.
- **Semantic HTML**: Proper headings, landmarks, and semantic structure.
- **Keyboard Navigation**: Full keyboard support for all interactive elements.
- **Screen Reader Support**: Skip links, proper form labels, descriptive ARIA attributes.

### Internationalization
- **Multi-Language Support**: Full i18n with English, French, and German using `next-intl`.
- **Centralized Configuration**: Easy-to-extend locale system with real country flags.
- **Type-Safe Translations**: All translation keys are type-safe and properly validated.

### Developer Experience
- **Git Hooks**: Husky pre-commit (lint) and pre-push (test) hooks ensure code quality.
- **Cross-Platform Hooks**: Node.js-based hooks work seamlessly on Windows, macOS, and Linux.
- **CI/CD**: Automated lint, test, and build pipeline in GitHub Actions.

## Implementation Details

### Server-side search & status filtering
- `/api/treatments` supports `search`, `status` (multi-select), `page`, and `pageSize` query params.
- `useTreatments` builds query strings from filters + pagination and fetches from API.
- Filters and pagination mirrored in URL via Next.js router for shareable links.
- Status filter supports multiple selections with comma-separated values in URL.

### Server-side pagination
- Backend slices results based on `page` and `pageSize`, returns `total`, `page`, `pageSize`, and `totalPages`.
- Frontend uses these values for pagination UI and keeps them in sync with URL.
- `PaginationControls` provide first/prev/next/last navigation with page indicator.
- Displays 12 items per page for optimal viewing.

### Add Treatment Dialog
- Uses `react-hook-form` + `zod` schema for client-side validation.
- Submits to `POST /api/treatments` with proper error handling:
  - 422 responses (validation errors) show inline messages and error toasts.
  - Other failures show friendly error toasts.
- Success: updates local state, shows success toast, closes dialog, resets form.
- Submit button disabled during submission with loading indicator.
- Reusable form field components (`FormTextField`, `FormDateField`, `FormTextareaField`).

### Status update with optimistic UI
- Treatment status changed via dropdown in each card.
- `updateTreatmentStatus` performs optimistic updates:
  - Immediately updates UI for instant feedback.
  - Calls `PATCH /api/treatments/:id` with new status.
  - Tracks loading per treatment (`updatingStatusIds`) to prevent duplicate actions.
  - On failure: rolls back changes and shows error toast.
  - On success: shows success toast with green background.
- Dropdown disabled during updates to prevent conflicts.

### UX polish
- **Loading skeletons** for treatments grid with proper placeholder count.
- **Error state** with `ErrorState` component and Retry button.
- **Empty state** with `EmptyState` component and "Clear filters" CTA.
- **Disabled states**: Pagination buttons disabled while loading.
- **Status badges** with color-coded, human-readable labels.
- **Card layout**: Labels and values inline (e.g., "Dentist: Dr. Someone").
- **Truncated notes** with tooltip showing full text on hover.
- **Compact design**: 4 cards per row on large screens, optimized spacing.

## Architecture decisions

- **Context + custom hook for treatments**
  - `TreatmentsProvider` wraps page and exposes `useTreatments` via context.
  - Keeps data fetching, filtering, pagination, and optimistic updates centralized.
  - Modular hook structure with focused sub-hooks for each concern.

- **URL-driven filters and pagination**
  - Search, status, and pagination stored in both local state and URL query string.
  - Enables sharable links, browser navigation, and server-side filtering.

- **Server-side filtering and pagination**
  - API applies all filters and pagination before returning data.
  - Frontend does minimal work (client-side sorting only) and trusts API.

- **UI composition**
  - Small, focused components with clearly defined props.
  - Shared components: `EmptyState`, `ErrorState`, `Skeleton`, form fields.
  - Consistent design system usage throughout.

- **Git hooks with Husky**
  - Husky v9.1.7 configured for pre-commit (lint) and pre-push (test) hooks.
  - Node.js-based hooks for cross-platform compatibility.
  - `.gitattributes` ensures LF line endings for hooks.

- **Type safety**
  - Explicit type annotations on all `useState` calls.
  - Removed all `any` types throughout codebase.
  - Proper TypeScript types for hooks, components, and API responses.

- **Accessibility (a11y)**
  - ARIA labels, roles, and live regions throughout.
  - Semantic HTML with proper headings and landmarks.
  - Full keyboard navigation support.
  - Skip-to-main-content link for screen readers.

## Libraries used and why

- **Next.js (app router)**: File-based routing, serverless API routes, locale-aware routing.
- **React Hook Form**: Lightweight, performant form state management with TypeScript support.
- **Zod + @hookform/resolvers**: Schema-based validation with type-safe form values.
- **next-intl**: Comprehensive i18n solution for Next.js with type-safe translations.
- **Sonner**: Modern, accessible toast notifications with custom styling.
- **Tailwind CSS**: Utility-first CSS with dark mode support and consistent design system.

## Trade-offs and assumptions

- **Husky hooks on Windows**: Node.js-based hooks for Windows/Git Desktop compatibility. Requires Node.js in PATH (standard for Node projects).
- **Loading states**: Initial state set to `true` to prevent content flash. Trade-off: slightly delayed empty state for better UX.
- **Optimistic UI updates**: Instant feedback with rollback on failure. Trade-off: requires rollback logic, but significantly better UX.
- **Multi-select status filter**: Dropdown with checkboxes for intuitive UX. Trade-off: more complex state management, but better user experience.
- **Server-side filtering**: All filtering on server. Trade-off: API calls on filter changes, but ensures consistency and scalability.
- **Debounced search**: 300ms delay. Trade-off: slight delay, but prevents excessive API calls and improves performance.

## What I would improve next

- **Better error messaging**: Surface specific error messages (404/500) while remaining user-friendly.
- **More granular loading states**: Track loading per action type for better UX feedback.
- **Form enhancements**: Add optional `status` and `cost` fields with proper validation and formatting.
