# Unit Test Notes - Future Test Cases

## Components to Test

### High Priority

**StatusFilter** - Multi-select logic, dropdown behavior, ARIA attributes, keyboard navigation

**SearchBar** - Debouncing, controlled/uncontrolled input, hydration, ARIA attributes

**TreatmentRow** - Status updates, loading states, tooltip, ARIA attributes, error handling

**useTreatments** - State management, filters, pagination, URL sync, cache, retry, clear filters

**useFetchTreatments** - API calls, abort handling, cache, error handling, sorting

**useFilters** - Filter updates, URL sync, error clearing, page reset

**useUrlSync** - URL to state sync, prevents duplicate requests, handles status arrays

**useTreatmentActions** - Optimistic updates, rollback, toast notifications, loading tracking

**treatmentsApi** - API integration, error handling, abort errors, schema validation

### Medium Priority

**TreatmentsTable** - Rendering, loading skeletons, grid layout, ARIA attributes

**TreatmentsContent** - Composition, conditional rendering, prop passing

**PaginationControls** - Navigation buttons, disabled states, keyboard navigation, edge cases

**ErrorState** - Error types (network, 404, 500), retry functionality, ARIA attributes

**LanguageSwitcher** - Locale switching, URL updates, query param preservation

**useAddTreatmentForm** - Form validation, submission, error handling, loading states

**useDebounce** - Debouncing logic, cancellation, type safety

**ApiError** - Error creation, status codes, error types

### Low Priority

**FiltersSection** - Component composition, prop passing

**EmptyState** - Rendering, default/custom content, ARIA attributes

**Header** - Layout, component rendering

**CountryFlag** - Image rendering, Next.js optimization

## Integration Scenarios

- Filter → Fetch → Display flow
- Add Treatment → Update List flow
- Status Update → Optimistic UI flow

## Accessibility

- ARIA labels, keyboard navigation, focus management, screen reader announcements, color contrast

## Performance

- Memoization, request cancellation, cache usage, debouncing

## Edge Cases

- Empty responses, large datasets, rapid changes, network timeouts, invalid data, browser navigation
