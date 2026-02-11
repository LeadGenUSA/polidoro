

## Rename `/testimonials` Route to `/reviews`

### Changes

**1. `src/App.tsx` (line 48)**
- Change `path="/testimonials"` to `path="/reviews"`

**2. `src/components/Navbar.tsx` (lines 30, 149-153, 304-308)**
- Change all `/testimonials` references to `/reviews` (nav link href, `to=`, `handleNavClick()`, and `isActive()` calls)

**3. `src/components/Footer.tsx` (line 46)**
- Change `to="/testimonials"` to `to="/reviews"`

**4. `src/components/Testimonials.tsx` (line 73)**
- Change `href="/testimonials"` to `href="/reviews"`

No file renames needed -- the component file `TestimonialsPage.tsx` keeps its current name; only the URL route and all links pointing to it are updated.

