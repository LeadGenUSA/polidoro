
# Survey Thank You - $50 Off Coupon Page

## Summary
Create a new "Thank You" coupon page that rewards customers with $50 off their next plumbing job for completing the customer survey. This page will be hidden from search engines to keep it exclusive to survey respondents.

## Files to Create

### 1. `src/pages/SurveyThankYouCoupon.tsx`
A new page based on the existing CouponPage design with these customizations:

**Content Changes:**
- Hero badge: "Thank You" instead of "Special Offer"
- Hero title: "Thanks for Your Feedback!"
- Hero subtitle: Thank you message acknowledging survey completion
- Discount amount: **$50** instead of 10%
- Description: "Your Next Plumbing or Heating Service"
- Additional thank you messaging in the coupon body

**SEO Prevention:**
- Add a `<Helmet>` component (or inline meta tag via `useEffect`) with:
  ```html
  <meta name="robots" content="noindex, nofollow">
  ```

**Same Features Retained:**
- Scissors decoration on coupon borders
- Company logo and branding
- Print button with printer-friendly CSS
- Contact information
- Terms and conditions

## Files to Modify

### 2. `src/App.tsx`
Add a new route for the thank you coupon page:
```tsx
<Route path="/survey-thank-you" element={<SurveyThankYouCoupon />} />
```

## Design Preview

```text
+--------------------------------------------------+
|           THANK YOU (badge)                       |
|         Thanks for Your Feedback!                 |
|  As a token of our appreciation for completing... |
+--------------------------------------------------+

+------------------COUPON------------------+
|   ✂️                              ✂️      |
|           [Company Logo]                 |
|    Big City Plumbing & Heating Inc.      |
|                                          |
|              [ $50 ]                     |
|               OFF                        |
|                                          |
|    Your Next Plumbing or Heating Service |
|                                          |
|    Thank you for taking the time to      |
|    share your feedback with us!          |
|                                          |
|    --------------------------------      |
|    * Terms and conditions apply          |
|    📞 631-361-9500 | 📍 Nassau, Suffolk  |
+------------------------------------------+

      [ 🖨️ Print This Coupon ]
```

## Technical Implementation

### Preventing Search Engine Indexing
The page will include a meta robots tag to prevent indexing:
```tsx
import { useEffect } from 'react';

// Inside component:
useEffect(() => {
  // Add noindex meta tag
  const metaRobots = document.createElement('meta');
  metaRobots.name = 'robots';
  metaRobots.content = 'noindex, nofollow';
  document.head.appendChild(metaRobots);
  
  return () => {
    document.head.removeChild(metaRobots);
  };
}, []);
```

### Route Path
The page will be accessible at `/survey-thank-you` - a path that:
- Is not linked from the navigation or footer
- Can be shared directly with customers after survey submission
- Could later be linked from the survey confirmation page

## Optional Enhancement
After this page is created, the Customer Survey form's success state could be updated to include a link to this thank you coupon page, making the $50 offer more discoverable to customers who complete the survey.
