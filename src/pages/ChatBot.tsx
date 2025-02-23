
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, MessagesSquare, Settings, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        isUser: true,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMessage]);
      setInputMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: "Thank you for your message. I am here to help you!",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">AI Assistant</span>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="w-full">
                      <MessagesSquare className="h-4 w-4" />
                      <span>New Chat</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="w-full">
                      <History className="h-4 w-4" />
                      <span>Chat History</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="w-full">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="w-full">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <div className="flex flex-col h-full">
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-2">Welcome to AI Assistant</h2>
                    <p className="text-muted-foreground">Start a conversation by typing a message below.</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </main>

            <div className="border-t p-4">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message here..."
                  className="min-h-[60px] resize-none"
                />
                <Button onClick={handleSendMessage} className="h-[60px]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
