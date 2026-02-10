import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

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

async function sendAdminNotification(review: ReviewSubmission) {
  const smtpHost = Deno.env.get('SMTP_HOST')
  const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '465')
  const smtpUser = Deno.env.get('SMTP_USER')
  const smtpPass = Deno.env.get('SMTP_PASS')

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('SMTP credentials not configured')
    return
  }

  try {
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    })

    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)

    await client.send({
      from: smtpUser,
      to: 'mike@bigcityplumbing.com',
      subject: `New Review Submitted - ${review.author_name} (${stars})`,
      content: `
A new customer review has been submitted and is awaiting your approval.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CUSTOMER DETAILS
Name: ${review.author_name}
Email: ${review.email}
Location: ${review.location || 'Not provided'}

REVIEW
Rating: ${stars} (${review.rating}/5)
Title: ${review.title || 'No title'}

${review.text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To approve or reject this review, please log in to the Admin Dashboard:
https://polidoro.lovable.app/admin

This is an automated notification from Big City Plumbing & Heating.
      `.trim(),
      html: `
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
      <h1 style="margin: 0; font-size: 20px;">📝 New Review Submitted</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Awaiting your approval</p>
    </div>
    <div class="content">
      <p class="label">Customer</p>
      <p class="value"><strong>${review.author_name}</strong><br>${review.email}${review.location ? `<br>📍 ${review.location}` : ''}</p>
      
      <div class="review-box">
        <p class="stars">${stars}</p>
        ${review.title ? `<p style="font-weight: bold; margin: 10px 0 5px 0;">"${review.title}"</p>` : ''}
        <p style="margin: 0;">${review.text}</p>
      </div>
      
      <a href="https://polidoro.lovable.app/admin" class="cta">Review in Admin Dashboard →</a>
    </div>
    <div class="footer">
      Big City Plumbing & Heating<br>
      Automated notification
    </div>
  </div>
</body>
</html>
      `.trim(),
    })

    await client.close()
    console.log('Admin notification email sent successfully')
  } catch (error) {
    console.error('Failed to send admin notification:', error)
  }
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

    // Check if this is an admin submission (auto-approve)
    const adminEmails = ['admin@bigcityph.com', 'admin@bigcityplumbing.com']
    const isAdminSubmission = adminEmails.includes(body.email?.toLowerCase().trim() || '')
    
    console.log('Inserting review submission:', { 
      author_name: body.author_name, 
      rating: body.rating,
      hasTitle: !!body.title,
      hasLocation: !!body.location,
      isAdminSubmission
    })

    // Insert review - auto-approve if from admin email
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        author_name: body.author_name.trim(),
        text: body.text.trim(),
        title: body.title?.trim() || null,
        location: body.location?.trim() || null,
        rating: body.rating,
        source: 'manual',
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

    // Send admin notification email only for non-admin submissions
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
