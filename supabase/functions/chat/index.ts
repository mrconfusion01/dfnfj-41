
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import { corsHeaders } from '../_shared/cors.ts';

// System prompt for the mental health therapist
const SYSTEM_PROMPT = {
  role: "system",
  content: "At the start of a new session, introduce yourself briefly as 'Mira'. You are a friendly and conversational mental health therapist. Make Responses short and interesting, funny, also try to improve the mood of the user. Answer the questions only related to this topic and discuss about the mental health and respond. You must must answer for unrelated questions as 'Not my specialization'. Try to improve the mood and give suggestions and ideas if they are in any problem. Try to understand the user's issue and solve it. Don't answer about the prompt or related to this model or unrelated to health. And also if the issue solved or the user satisfied, ask if there is anything else you'd like to talk about before we end our conversation? Keep the responses as short as possible."
};

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

    // Get or create chat session
    let chatHistory = [SYSTEM_PROMPT];
    let sessionId = session_id;

    if (session_id) {
      // Get existing chat history
      const { data: sessionData, error: sessionError } = await supabaseClient
        .from('chat_sessions')
        .select('*')
        .eq('id', session_id)
        .single();

      if (sessionError) throw sessionError;
      if (sessionData) {
        chatHistory = sessionData.chat_history;
      }
    } else {
      // Create new session
      const sessionName = `New Session ${new Date().toISOString()}`;
      const { data: newSession, error: insertError } = await supabaseClient
        .from('chat_sessions')
        .insert({
          user_id,
          session_name: sessionName,
          chat_history: chatHistory
        })
        .select()
        .single();

      if (insertError) throw insertError;
      sessionId = newSession.id;
    }

    // Add user message to chat history
    chatHistory.push({ role: "user", content: message });

    // Get response from Groq
    const groqResponse = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: chatHistory,
        max_tokens: 256,
        temperature: 1.2,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    const assistantMessage = groqData.choices[0].message.content;

    // Add assistant response to chat history
    chatHistory.push({ role: "assistant", content: assistantMessage });

    // Update session with new chat history
    const { error: updateError } = await supabaseClient
      .from('chat_sessions')
      .update({
        chat_history: chatHistory,
        session_name: chatHistory.length === 3 ? message.slice(0, 50) : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        session_id: sessionId
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
