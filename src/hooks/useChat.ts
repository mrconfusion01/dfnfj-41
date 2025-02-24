
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  session_name: string;
  created_at: string;
  updated_at: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch sessions for the current user
  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`/api/sessions?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSessions(data.sessions || []);
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive",
      });
    }
  };

  // Load a specific session
  const loadSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await fetch(`/api/session/${sessionId}?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.session) {
        const chatHistory = JSON.parse(data.session.chat_history);
        // Filter out system messages
        const displayMessages = chatHistory.filter((msg: Message) => msg.role !== 'system');
        setMessages(displayMessages);
        setCurrentSessionId(sessionId);
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start a new session
  const startNewSession = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  // Send a message
  const sendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to continue the conversation",
          variant: "destructive",
        });
        return;
      }

      // Add user message immediately for better UX
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: user.id,
          session_id: currentSessionId,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant's response
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      
      // If this is a new session, update the session ID and fetch sessions
      if (!currentSessionId && data.session_id) {
        setCurrentSessionId(data.session_id);
        fetchSessions();
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    sendMessage,
    loadSession,
    startNewSession,
    fetchSessions,
  };
};
