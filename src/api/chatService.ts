
import { supabase } from "@/integrations/supabase/client";

const API_URL = "https://flaskdemio.onrender.com";

// Helper to get the auth token
const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

export const chatService = {
  // Get all chat sessions for the user
  async getChatSessions() {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/chat/sessions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error("Failed to fetch chat sessions");
    return response.json();
  },
  
  // Get a specific chat session with its messages
  async getChatSession(sessionId: number) {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error("Failed to fetch chat session");
    return response.json();
  },
  
  // Create a new chat session
  async createChatSession(title = "New Chat") {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/chat/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title })
    });
    
    if (!response.ok) throw new Error("Failed to create chat session");
    return response.json();
  },
  
  // Delete a chat session
  async deleteChatSession(sessionId: number) {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error("Failed to delete chat session");
    return response.json();
  },
  
  // Send a message to the chatbot
  async sendMessage(sessionId: number, message: string, chatHistory: any[] = []) {
    const token = await getAuthToken();
    if (!token) throw new Error("Not authenticated");
    
    const response = await fetch(`${API_URL}/api/chat/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id: sessionId,
        message,
        chat_history: chatHistory
      })
    });
    
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  }
};
