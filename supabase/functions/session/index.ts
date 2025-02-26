
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = {
  role: "system",
  content: "You are a friendly and empathetic AI companion. Your purpose is to engage in meaningful conversations, provide emotional support, and help users process their thoughts and feelings. Be genuine, understanding, and supportive in your responses."
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with admin privileges
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the JWT token from the request header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the JWT token and get user data
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      throw new Error('Unauthorized')
    }

    // Parse request body
    const { title = "New Chat" } = await req.json().catch(() => ({}))
    
    console.log(`Creating chat session for user_id: ${user.id}`)
    console.log(`Session title: ${title}`)

    // Create new session in Supabase
    const { data: session, error: insertError } = await supabaseClient
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        session_name: title,
        chat_history: [SYSTEM_PROMPT]
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error(`Failed to create session: ${insertError.message}`)
    }

    if (!session) {
      console.error('No data returned from insert')
      throw new Error('Failed to create session - no data returned')
    }

    console.log('Session created successfully:', session)

    return new Response(
      JSON.stringify({
        session: {
          id: session.id,
          title: session.session_name,
          chat_history: session.chat_history
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      }
    )

  } catch (error) {
    console.error('Error in session creation:', error)
    
    // Determine appropriate status code
    let status = 500
    if (error.message === 'Unauthorized' || error.message === 'No authorization header') {
      status = 401
    }

    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    )
  }
})
