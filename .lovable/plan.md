## Goal

Completely remove the Tawk.to live chat integration from the site.

## Changes

1. **Delete** `src/components/LiveChatEmbed.tsx`
2. **Edit** `src/App.tsx`:
   - Remove the `import LiveChatEmbed from "./components/LiveChatEmbed";` line
   - Remove the `<LiveChatEmbed />` element from the `<BrowserRouter>` block

## Outcome

- No Tawk.to script will be injected on any route
- The chat widget will no longer appear anywhere on the site
- No leftover references to Tawk in the codebase