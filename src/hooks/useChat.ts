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
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Function to abort ongoing requests
  const abortCurrentRequest = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsLoading(false);
  };

  // Fetch sessions for the current user
  const fetchSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('sessions', {
        method: 'GET',
        body: { user_id: user.id }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Only set sessions if there are any
      if (data.sessions && data.sessions.length > 0) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (error: any) {
      console.error('Error fetching sessions:', error);
      setSessions([]); // Reset sessions on error
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

      const { data, error } = await supabase.functions.invoke('session', {
        method: 'GET',
        body: { 
          user_id: user.id,
          session_id: sessionId
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        const chatHistory = data.session.chat_history;
        // Filter out system messages
        const displayMessages = chatHistory.filter((msg: Message) => msg.role !== 'system');
        setMessages(displayMessages);
        setCurrentSessionId(sessionId);
      } else {
        // Handle case where session doesn't exist
        setMessages([]);
        setCurrentSessionId(null);
        toast({
          title: "Error",
          description: "Chat session not found",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error loading session:', error);
      setMessages([]);
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
    abortCurrentRequest(); // Abort any ongoing request
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

      // Create new abort controller for this request
      const controller = new AbortController();
      setAbortController(controller);

      // Add user message immediately for better UX
      setMessages(prev => [...prev, { role: 'user', content: message }]);

      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          message,
          user_id: user.id,
          session_id: currentSessionId,
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }

      // Only add assistant's response if not aborted
      if (!controller.signal.aborted) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        
        // If this is a new session, update the session ID and fetch sessions
        if (!currentSessionId && data.session_id) {
          setCurrentSessionId(data.session_id);
          fetchSessions();
        }
      }

    } catch (error: any) {
      // Only show error if not aborted
      if (error.name !== 'AbortError') {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.'
        }]);
      }
    } finally {
      if (abortController) {
        setAbortController(null);
      }
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortCurrentRequest();
    };
  }, []);

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
