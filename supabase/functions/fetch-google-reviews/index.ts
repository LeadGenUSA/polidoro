import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create client with user's auth for role checking
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user is authenticated and has admin role
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseAuth
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Google Places API key
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!googleApiKey) {
      return new Response(
        JSON.stringify({ error: 'Google Places API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Big City Plumbing & Heating Inc. Place ID
    const placeId = 'ChIJX_YHUWE46IkRZM8fGulCPik';
    
    console.log('Fetching reviews for place ID:', placeId);

    // Fetch place details including reviews from Google Places API (New)
    const placesUrl = `https://places.googleapis.com/v1/places/${placeId}`;
    
    const placesResponse = await fetch(placesUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleApiKey,
        'X-Goog-FieldMask': 'displayName,reviews',
      },
    });
    const placesData = await placesResponse.json();

    console.log('Google Places API (New) response status:', placesResponse.status);

    if (!placesResponse.ok) {
      console.error('Google Places API error:', JSON.stringify(placesData));
      return new Response(
        JSON.stringify({ 
          error: `Google Places API error: ${placesResponse.status}`,
          message: placesData.error?.message || 'Unknown error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reviews = placesData.reviews || [];
    console.log(`Found ${reviews.length} reviews from Google`);

    if (reviews.length === 0) {
      return new Response(
        JSON.stringify({ imported: 0, message: 'No reviews found for this place' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service role client for database operations (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get existing google_review_ids to avoid duplicates
    const { data: existingReviews } = await supabaseAdmin
      .from('reviews')
      .select('google_review_id')
      .not('google_review_id', 'is', null);

    const existingIds = new Set(existingReviews?.map(r => r.google_review_id) || []);

    // Prepare new reviews for insertion
    const newReviews = reviews
      .filter((review: any) => {
        // Create a unique ID from author name and publish time
        const authorName = review.authorAttribution?.displayName || 'Anonymous';
        const publishTime = review.publishTime || '';
        const reviewId = `${authorName}_${publishTime}`;
        return !existingIds.has(reviewId);
      })
      .map((review: any) => {
        const authorName = review.authorAttribution?.displayName || 'Anonymous';
        const publishTime = review.publishTime || new Date().toISOString();
        return {
          google_review_id: `${authorName}_${publishTime}`,
          author_name: authorName,
          author_photo_url: review.authorAttribution?.photoUri || null,
          rating: review.rating,
          text: review.text?.text || review.originalText?.text || '',
          review_date: publishTime,
          source: 'google' as const,
          status: 'pending' as const,
        };
      });

    console.log(`Inserting ${newReviews.length} new reviews`);

    if (newReviews.length === 0) {
      return new Response(
        JSON.stringify({ imported: 0, message: 'All reviews have already been imported' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert new reviews using service role client (bypasses RLS)
    const { error: insertError } = await supabaseAdmin
      .from('reviews')
      .insert(newReviews);

    if (insertError) {
      console.error('Error inserting reviews:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        imported: newReviews.length,
        message: `Successfully imported ${newReviews.length} new review(s)`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in fetch-google-reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
