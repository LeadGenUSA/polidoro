import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { verifyTurnstile } from '../_shared/verify-turnstile.ts'
import { sendEmail } from '../_shared/send-email.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const compactEmailHtml = (html: string) =>
  html
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\n/g, "")
    .trim();

interface ReviewSubmission {
  author_name: string
  email: string
  location?: string
  title?: string
  text: string
  rating: number
}

async function sendAdminNotification(review: ReviewSubmission) {
  try {
    const asciiStars = '*'.repeat(review.rating) + '-'.repeat(5 - review.rating)
    const htmlStars = '&#9733;'.repeat(review.rating) + '&#9734;'.repeat(5 - review.rating)

    await sendEmail({
      to: ['mike@bigcityplumbing.com', 'diane@bigcityplumbing.com', 'info@bigcityplumbing.com'],
      subject: `New Review Submitted - ${review.author_name} (${asciiStars})`,
      html: compactEmailHtml(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .review-box { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 15px 0; }
    .stars { color: #f59e0b; font-size: 20px; }
    .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
    .value { margin-bottom: 10px; }
    .cta { display: inline-block; background: #f59e0b; color: #1e3a5f; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 15px; }
    .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 20px;">New Review Submitted</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Awaiting your approval</p>
    </div>
    <div class="content">
      <p class="label">Customer</p>
      <p class="value"><strong>${review.author_name}</strong><br>${review.email}${review.location ? `<br>${review.location}` : ''}</p>
      
      <div class="review-box">
        <p class="stars">${htmlStars}</p>
        ${review.title ? `<p style="font-weight: bold; margin: 10px 0 5px 0;">"${review.title}"</p>` : ''}
        <p style="margin: 0;">${review.text}</p>
      </div>
      
      <a href="https://polidoro.lovable.app/admin" class="cta">Review in Admin Dashboard</a>
    </div>
    <div class="footer">
      Big City Plumbing & Heating<br>
      Automated notification
    </div>
  </div>
</body>
</html>
      `),
    })

    console.log('Admin notification email sent successfully via Resend')
  } catch (error) {
    console.error('Failed to send admin notification:', error)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { turnstileToken, ...body }: ReviewSubmission & { turnstileToken?: string } = await req.json()

    const isValid = await verifyTurnstile(turnstileToken)
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Bot verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
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
    
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
    
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

    const adminEmails = ['admin@bigcityph.com', 'admin@bigcityplumbing.com']
    const isAdminSubmission = adminEmails.includes(body.email?.toLowerCase().trim() || '')
    
    console.log('Inserting review submission:', { 
      author_name: body.author_name, 
      rating: body.rating,
      hasTitle: !!body.title,
      hasLocation: !!body.location,
      isAdminSubmission
    })

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        author_name: body.author_name.trim(),
        text: body.text.trim(),
        title: body.title?.trim() || null,
        location: body.location?.trim() || null,
        rating: body.rating,
        source: isAdminSubmission ? 'manual' : 'website',
        status: isAdminSubmission ? 'approved' : 'pending',
        approved_at: isAdminSubmission ? new Date().toISOString() : null,
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

    console.log('Review submitted successfully:', data.id, isAdminSubmission ? '(auto-approved)' : '(pending)')

    if (!isAdminSubmission) {
      sendAdminNotification(body).catch(err => console.error('Email notification failed:', err))
    }

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
