import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function parseIsoDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return '0:00'
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function formatViewCount(count: string): string {
  const n = parseInt(count)
  if (isNaN(n)) return count
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return count
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Auth check
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token)
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const userId = claimsData.claims.sub

    // Check admin role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
    const { data: roleData } = await supabaseAdmin.from('user_roles').select('role').eq('user_id', userId).eq('role', 'admin').maybeSingle()
    if (!roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY')
    if (!youtubeApiKey) {
      return new Response(JSON.stringify({ error: 'YouTube API key not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const channelId = 'UC8fcDyolqilmFXHt8pg377Q'

    // Fetch all video IDs from channel using search.list (paginated)
    let allVideoIds: string[] = []
    let nextPageToken = ''
    do {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&type=video&maxResults=50&order=date&key=${youtubeApiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      const searchRes = await fetch(searchUrl)
      const searchData = await searchRes.json()

      if (searchData.error) {
        console.error('YouTube search API error:', searchData.error)
        return new Response(JSON.stringify({ error: 'YouTube API error', details: searchData.error.message }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      const ids = (searchData.items || []).map((item: any) => item.id?.videoId).filter(Boolean)
      allVideoIds = [...allVideoIds, ...ids]
      nextPageToken = searchData.nextPageToken || ''
    } while (nextPageToken)

    if (allVideoIds.length === 0) {
      return new Response(JSON.stringify({ message: 'No videos found on channel', imported: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Fetch video details in batches of 50
    const videosToUpsert: any[] = []
    for (let i = 0; i < allVideoIds.length; i += 50) {
      const batch = allVideoIds.slice(i, i + 50)
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${batch.join(',')}&key=${youtubeApiKey}`
      const detailsRes = await fetch(detailsUrl)
      const detailsData = await detailsRes.json()

      for (const item of (detailsData.items || [])) {
        videosToUpsert.push({
          youtube_id: item.id,
          title: item.snippet.title,
          description: item.snippet.description?.substring(0, 500) || null,
          thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          duration: parseIsoDuration(item.contentDetails.duration),
          view_count: formatViewCount(item.statistics.viewCount || '0'),
          published_at: item.snippet.publishedAt,
        })
      }
    }

    // Upsert into database
    const { error: upsertError } = await supabaseAdmin.from('youtube_videos').upsert(
      videosToUpsert,
      { onConflict: 'youtube_id' }
    )

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return new Response(JSON.stringify({ error: 'Database error', details: upsertError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ message: `Successfully synced ${videosToUpsert.length} videos`, imported: videosToUpsert.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    console.error('Unhandled error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
