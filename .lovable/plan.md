
# Link "View Our Services" to Services Page

## Summary
The "View Our Services" button in the Hero component is currently non-functional. I'll wrap it with a React Router Link to navigate to the `/services` page.

## Change Required

**File: `src/components/Hero.tsx`** (lines 159-161)

Update the button to use React Router navigation:

```text
Current:
  <Button variant="heroOutline" size="xl">
    View Our Services
  </Button>

Updated:
  <Button variant="heroOutline" size="xl" asChild>
    <Link to="/services">
      View Our Services
    </Link>
  </Button>
```

This follows the same pattern used elsewhere in the codebase (like the "Request Estimate" button on the Services page).

## Technical Notes
- The `Link` component from `react-router-dom` should already be imported in the file
- The `asChild` prop allows the Button to render as a Link while keeping button styling
