## Enhance LocalBusiness Schema with aggregateRating, sameAs, and image

### What's Changing

Three new properties will be added to the `localBusinessSchema` object in `src/pages/Index.tsx`:

### 1. aggregateRating

Adds a star rating summary that can appear in Google rich results:

```js
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "70",
  "bestRating": "5"
}
```

**Note:** You should adjust `ratingValue` and `reviewCount` to match your actual Google/Yelp numbers. I'll use placeholder values you can confirm.

### 2. sameAs (social profiles)

Links the business entity to its official social profiles, pulled from your footer:

```js
"sameAs": [
  "http://www.facebook.com/bigcityplumbing",
  "https://x.com/bigcityplumbing",
  "https://www.linkedin.com/profile/view?id=AAkAAAUWvLUB1msy7omBhpMetwl7zMHANsC8wzs",
  "http://www.yelp.com/biz/big-city-plumbing-and-heating-centereach",
  "https://www.youtube.com/channel/UC8fcDyolqilmFXHt8pg377Q"
]
```

### 3. image

Provides a representative business image for rich results:

```js
"image": "https://www.bigcityplumbing.com/favicon.png"
```

This uses the same image as the existing `logo` property. If you have a higher-quality storefront or team photo hosted publicly, that would be even better.

### File Changed

- `**src/pages/Index.tsx**` -- add three properties to the `localBusinessSchema` object (after `priceRange` on line 48)

### Technical Details

All three properties are added as keys on the existing object literal. No other files or components need changes since the `SEO` component already serializes the full object to JSON-LD.