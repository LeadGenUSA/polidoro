

## Change "Get Free Estimate" Button to Scroll to Contact Section

The "Get Free Estimate" button in the hero section currently navigates to the `/free-estimate` page. It will be updated to scroll down to the Contact Us section at the bottom of the home page instead.

### Technical Change

In `src/components/Hero.tsx` (around line 148):
- Change the `Link to="/free-estimate"` to an anchor link `a href="#contact"` so it scrolls to the existing Contact section (which already has `id="contact"`).

This is a one-line change -- the button text and styling remain the same.

