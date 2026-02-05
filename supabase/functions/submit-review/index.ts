import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReviewSubmission {
  author_name: string
  email: string
  location?: string
  title?: string
  text: string
  rating: number
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Use service role to bypass RLS for inserting pending reviews
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body: ReviewSubmission = await req.json()
    
    // Validate required fields
    if (!body.author_name || body.author_name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!body.text || body.text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Review text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return new Response(
        JSON.stringify({ error: 'Rating must be between 1 and 5' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Validate email format if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
    
    // Validate text lengths
    if (body.author_name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Name must be less than 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (body.text.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Review must be less than 2000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (body.title && body.title.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Title must be less than 200 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (body.location && body.location.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Location must be less than 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Inserting review submission:', { 
      author_name: body.author_name, 
      rating: body.rating,
      hasTitle: !!body.title,
      hasLocation: !!body.location 
    })

    // Insert review with pending status
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        author_name: body.author_name.trim(),
        text: body.text.trim(),
        title: body.title?.trim() || null,
        location: body.location?.trim() || null,
        rating: body.rating,
        source: 'manual',
        status: 'pending',
        review_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting review:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to submit review' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Review submitted successfully:', data.id)

    return new Response(
      JSON.stringify({ success: true, message: 'Review submitted for approval' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
