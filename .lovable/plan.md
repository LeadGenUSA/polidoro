

## Reorder Services on the Services Page

Swap the order of the first two services so **Heating Systems** appears first and **Plumbing Repair** appears second.

### Change
In `src/pages/Services.tsx`, move the "Heating Systems" object to index 0 and "Plumbing Repair" to index 1 in the `services` array. All other services remain in their current order.

**Final order:**
1. Heating Systems
2. Plumbing Repair
3. Tankless Water Heaters
4. Gas Conversion
5. Emergency Services

### Technical Detail
- File: `src/pages/Services.tsx` (lines ~18-95)
- Only the array element order changes; no other code is modified.

