
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, user_id, session_id } = await req.json();

    if (!message || !user_id) {
      throw new Error('Message and user ID are required');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let currentSession;
    let currentHistory = [];

    // If session_id is provided, fetch existing session
    if (session_id) {
      const { data: existingSession } = await supabaseClient
        .from('chat_sessions')
        .select('*')
        .eq('id', session_id)
        .single();

      if (existingSession) {
        currentSession = existingSession;
        currentHistory = existingSession.chat_history || [];
      }
    }

    // Add user message to history
    currentHistory.push({ role: 'user', content: message });

    // Generate assistant response (placeholder for now)
    const assistantMessage = `Thank you for your message: "${message}". I'm here to help!`;
    currentHistory.push({ role: 'assistant', content: assistantMessage });

    // Update or create session
    if (currentSession) {
      // Update existing session
      const { error: updateError } = await supabaseClient
        .from('chat_sessions')
        .update({
          chat_history: currentHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', session_id);

      if (updateError) throw updateError;
    } else {
      // Create new session
      const { data: newSession, error: insertError } = await supabaseClient
        .from('chat_sessions')
        .insert({
          user_id,
          chat_history: currentHistory,
          session_name: message.substring(0, 50) + '...',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      currentSession = newSession;
    }

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        session_id: currentSession.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
