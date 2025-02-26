
import { supabase } from "@/integrations/supabase/client";

const API_URL = "https://flaskdemio.onrender.com";

// Helper to get the auth token
const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  console.log("Auth token:", token ? token.substring(0, 10) + "..." : "No token");
  return token;
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
 export async function createChatSession() {
    const user = await supabase.auth.getUser();
    if (!user || !user.data || !user.data.user) {
        console.error("User not authenticated");
        return;
    }

    const token = user.data.session?.access_token;
    console.log("Auth token:", token); // Debugging: Ensure token is available

    try {
        const response = await fetch("https://flaskdemio.onrender.com/api/chat/sessions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Ensure token is sent
            },
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error("Failed to create chat session");
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to create chat session:", error);
        throw error;
    }
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
