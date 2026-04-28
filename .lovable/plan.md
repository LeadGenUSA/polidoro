## Goal

Add an Instagram social link to the footer pointing to https://www.instagram.com/bigcityplumbingandheating/

## Change

In `src/components/Footer.tsx`, add an Instagram icon link inside the social links group (alongside Facebook, X, LinkedIn, Yelp, YouTube). Use the `Instagram` icon from `lucide-react` (added to existing import) and match the existing styling pattern (`w-10 h-10 rounded-lg bg-primary-foreground/10 hover:bg-secondary ...`).

Order: place Instagram right after Facebook to keep Meta platforms grouped.

## Files

- `src/components/Footer.tsx` (edit)