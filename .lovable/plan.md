

# Create llm.txt for Big City Plumbing and Heating

## Overview
Create an `llm.txt` file and update `robots.txt` to help AI models understand the business.

## Files to create/modify

### 1. New file: `public/llm.txt`
Plain-text file with structured business information:

- **Business**: Big City Plumbing and Heating
- **Owner**: Michael Polidoro, Former NYC Plumbing Inspector, Master Plumber
- **Address**: 2639 Middle Country Rd, Centereach, NY 11720
- **Phones**: 631-361-9500 (Long Island), 718-326-5833 (NYC)
- **Website**: https://www.bigcityplumbing.com
- **Service areas**: Nassau County, Suffolk County, Queens, Brooklyn, Manhattan, Bronx, Staten Island
- **Plumbing services**: Repairs, installations, permits, RPZ, water heaters, slab leaks, gas lines, water filtration, emergency service
- **Heating services**: Boiler installation, oil-to-gas conversion, radiant heat, tankless water heaters, Navien certified
- **Credentials**: 35+ years experience, 5000+ projects, licensed and insured, authorized Navien dealer, 24-hour response time

### 2. Update: `public/robots.txt`
Add a comment and reference line pointing to `llm.txt` so AI crawlers can discover it.

## Technical notes
- File is placed in `public/` so Vite serves it at the site root (`bigcityplumbing.com/llm.txt`)
- No code changes or new dependencies required
