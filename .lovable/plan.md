

## Add Industry Leading Products Image to Heating Services Page

This task involves adding the uploaded "Industry Leading Products" image below the heating services grid section on the Heating Services page.

### What Will Be Done

The image showcasing Energy Star certified boilers and heating equipment will be added as a new section between the services grid and the Oil to Gas Conversion section.

### Implementation Steps

**1. Copy the uploaded image to the project**
- Copy `user-uploads://Industryleadingproducts.jpg.webp` to `src/assets/industry-leading-products.webp`

**2. Update `src/pages/HeatingServices.tsx`**
- Import the new image at the top of the file
- Add a new section after the services grid (after line 129) displaying the image
- The image will be displayed full-width within a container for proper responsive sizing
- Add appropriate alt text for accessibility

### New Section Structure

The new section will be inserted between the services grid and the Gas Conversion section:

```text
┌─────────────────────────────────────────┐
│           Services Grid Section          │
│        (existing - ends at line 129)     │
└─────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│     NEW: Industry Leading Products       │
│                                          │
│   [Full-width responsive image with      │
│    the uploaded boiler equipment photo]  │
│                                          │
└─────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────┐
│       Gas Conversion Section             │
│        (existing - starts at line 131)   │
└─────────────────────────────────────────┘
```

### Technical Details

| Aspect | Implementation |
|--------|----------------|
| Image Location | `src/assets/industry-leading-products.webp` |
| Import Method | ES6 module import for optimization |
| Styling | Full-width container with rounded corners |
| Responsive | Image scales appropriately on all devices |
| Alt Text | "Industry Leading Products - Energy Star certified boilers and heating equipment" |

