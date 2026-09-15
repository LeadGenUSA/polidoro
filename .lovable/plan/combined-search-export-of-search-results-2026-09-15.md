# Combined search + export of search results

Search work order records (including Imported) with one or more conditions at once, then export exactly what the search found.

## How it works

1. In the search box you can type a single condition, for example `Boiler Type: NCB240`, or several joined by `and`, for example:
   `Boiler Type: NCB240 and Date Installed: 6/24/2021`
2. Each condition can be written as `Heading: value` (matches that column heading and its value) or as plain text (matches anywhere in the record).
3. Only records matching **all** conditions are shown. Matching stays case-insensitive and partial, so `6/24/2021` also matches a longer date text.
4. A line above the results shows how many records matched.
5. The Export CSV button exports the records currently on screen — the search results for the selected tab. With an empty search box it behaves as today and exports the whole tab.
6. Columns imported under their own headings are included in the export, each as its own column.

Works the same on the Imported tab and on New, Reviewed, Archived and All, and for Estimates and Surveys too.

## Technical notes

- `src/components/admin/SubmissionsManager.tsx`
  - Parse the query into terms by splitting on a standalone ` and ` (also accept `&&` and newlines). Each term is trimmed; empty terms dropped.
  - For a term containing `:`, split on the first colon into `key` / `value`: the record matches when some field (top-level column name, or an `extra_fields` heading) whose name loosely matches `key` has a value containing `value`. Loose name match uses the existing header-style normalisation (lowercase, strip spaces/underscores/dashes), plus a `fieldLabel`-style comparison so "Boiler Type" matches `boiler_type`.
  - For a term without `:`, keep the current recursive `valueMatches` behaviour.
  - A record passes when every term matches (AND).
  - Keep `EXCLUDED_SEARCH_KEYS` / `isExcludedKey` for the plain-text path; for `key: value` terms allow any non-excluded key, including `extra_fields` sub-keys.
  - Show a small result-count line when a search is active.
  - Pass `filteredSubmissions` to the export handler.
- `src/hooks/useSubmissions.tsx`
  - `exportToCSV(rows?)` — when `rows` is supplied, export those instead of `submissions`; keep the same CSV quoting, filename and toast (count from the exported rows).
  - Header set: union of keys across exported rows; flatten `extra_fields` into one column per heading rather than dumping raw JSON.
- No schema, backend or policy changes.
