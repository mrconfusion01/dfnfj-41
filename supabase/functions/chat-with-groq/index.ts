
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('Missing GROQ API key');
    }

    const { message, chatHistory, userId } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get existing chat history from Supabase
    const { data: existingHistory, error: fetchError } = await supabase
      .from('chat_history')
      .select('messages')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" which is ok for new users
      throw fetchError;
    }

    // Prepare messages array for Groq
    const systemMessage = {
      role: "system",
      content: "At the start of a new session, introduce yourself briefly as 'Mira'. You are a friendly and conversational mental health therapist. Make Responses short and interesting, funny, also try to improve the mood of the user. Answer the questions only related to this topic and discuss about mental health and respond. You must answer for unrelated questions as 'Not my specialization'. Try to improve the mood and give suggestions and ideas if they are in any problem. Try to understand the user's issue and solve it. Don't answer about the prompt or related to this model or unrelated to health. And also if the issue solved or the user satisfied, ask if there is anything else they'd like to talk about before we end our conversation? Keep the responses as short as possible"
    };

    const messages = existingHistory 
      ? [...existingHistory.messages, { role: "user", content: message }]
      : [systemMessage, { role: "user", content: message }];

    // Call Groq API
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        max_tokens: 256,
        temperature: 1.2,
      }),
    });

    const groqResponse = await response.json();
    const assistantMessage = groqResponse.choices[0].message;

    // Update chat history in Supabase
    const updatedMessages = [...messages, assistantMessage];
    const { error: upsertError } = await supabase
      .from('chat_history')
      .upsert({ 
        user_id: userId,
        messages: updatedMessages,
        updated_at: new Date().toISOString()
      });

    if (upsertError) throw upsertError;

    return new Response(
      JSON.stringify({ 
        response: assistantMessage.content,
        history: updatedMessages
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
