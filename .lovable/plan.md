

## Replace BC Logo with Company Logo

This task involves replacing the current "BC" text placeholder in both the header (Navbar) and footer with your uploaded circular logo image.

### Changes Required

**1. Copy Logo to Assets**
- Copy the uploaded logo (`big-city-plumbing-and-heating.png`) to `src/assets/` folder for proper bundling and optimization

**2. Update src/components/Navbar.tsx**
- Import the logo image at the top of the file
- Replace the current "BC" div placeholder (lines 57-59) with an `<img>` element displaying the logo
- Style the image to fit properly (approximately 40x40px to match current size, with rounded styling)

**3. Update src/components/Footer.tsx**
- Import the logo image at the top of the file  
- Replace the current "BC" div placeholder (lines 13-15) with an `<img>` element displaying the logo
- Apply matching styling for consistency

### Technical Details

| Component | Current Implementation | New Implementation |
|-----------|----------------------|-------------------|
| Navbar | `<div className="w-10 h-10..."><span>BC</span></div>` | `<img src={logo} className="w-10 h-10 rounded-xl object-cover" />` |
| Footer | `<div className="w-10 h-10..."><span>BC</span></div>` | `<img src={logo} className="w-10 h-10 rounded-xl object-cover" />` |

The circular logo will be displayed at 40x40 pixels with rounded corners to maintain the current design aesthetic while showing your actual company branding.

