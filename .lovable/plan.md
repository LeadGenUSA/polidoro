
# Import Reviews from Text File

## Overview
Parse and import 18 customer reviews from the uploaded text file into the database as approved Website Reviews with 5-star ratings.

## Parsed Reviews (18 total)

| # | Name | Date | Location | Title |
|---|------|------|----------|-------|
| 1 | Joel and Linda | April 4, 2023 | E. Setauket, NY | Impeccable workmanship |
| 2 | Branko Yurisak | December 20, 2022 | Kings Park, NY | Big City Plumbing RULES!!! |
| 3 | Judy | December 22, 2021 | W. Hempstead, NY | Finally a honest company! |
| 4 | Kathleen Rodriguez | April 15, 2021 | Brooklyn, NY | Saint Mike |
| 5 | Angelo Strazzera | October 17, 2019 | South Setauket | Great Service! |
| 6 | Kathy Rodriguez | June 22, 2019 | Brooklyn ny | Tankless heater |
| 7 | Vincent Danna | May 13, 2019 | Stony Brook | Above and Beyond |
| 8 | Bob Scottaline (Mayor Bob) | December 9, 2018 | Lake Grove | Old School Quality and Service |
| 9 | Shikui Chen | June 13, 2018 | Stony Brook | Professional Service! |
| 10 | Andy Levine | August 23, 2017 | Centereach | Amazing job |
| 11 | Wendy | June 24, 2017 | Merrick, NY | Fabulous job |
| 12 | Ambra and Jerry | April 25, 2017 | South Setauket, NY | Great service |
| 13 | Pierre Amestoy | February 14, 2017 | Queens, NY | The best |
| 14 | Joe Becker | January 26, 2017 | Centereach | Expertise |
| 15 | Joe and Meg | December 29, 2016 | Centereach | Hot water again!! |
| 16 | John Mcalister | September 12, 2016 | LI | I was very happy. |
| 17 | Gregg P | July 27, 2016 | Smithtown | Smart Decision |
| 18 | Larry | November 4, 2015 | Centereach | I highly recommend them to you! |
| 19 | John Z | October 10, 2015 | Brooklyn | Thank you very much! |
| 20 | James P. | September 3, 2015 | St. James | Thank you. |
| 21 | Jimmy V. | June 13, 2015 | Smithtown, L.I. | I can't say enough. |
| 22 | Nancy & Joe C. | September 29, 2014 | Bay Shore, NY | We love you! |
| 23 | Joe M. | September 9, 2014 | New York | Pleasure dealing... |
| 24 | donaldturn's | January 29, 2013 | L.I. | Would use them again. |

## Data Mapping

Each review will be inserted with:
- **rating**: 5 (all 5 stars)
- **source**: `'manual'` (displays as "Website Review")
- **status**: `'approved'` (immediately visible)
- **approved_at**: Current timestamp
- **review_date**: Parsed from the original submission date
- **author_name**: Extracted from file
- **location**: Extracted from file
- **title**: Extracted from file
- **text**: Full review content

## Implementation Steps

1. **Insert reviews into database**
   - Use the Supabase insert tool to add all 24 reviews in a single batch operation
   - Set all fields appropriately for immediate publishing

2. **Verification**
   - Reviews will appear in Admin Dashboard under "Approved" tab
   - Reviews will display on the public Testimonials page with "Website Review" badge

---

## Technical Details

The SQL insert will use the following structure for each review:

```text
INSERT INTO reviews (
  author_name,
  title,
  text,
  location,
  rating,
  source,
  status,
  review_date,
  approved_at
) VALUES (...)
```

All dates will be converted to proper timestamps (e.g., "April 4, 2023" becomes "2023-04-04").
