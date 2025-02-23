
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { History, MessagesSquare, Settings, User } from "lucide-react";
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

export default function ChatBot() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkSession();
  }, [navigate]);

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
                <span className="text-sm font-medium">Soulmate.ai</span>
                <span className="text-xs text-muted-foreground">AI Therapist</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button>
                      <MessagesSquare />
                      <span>New Chat</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button>
                      <History />
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
                    <button>
                      <User />
                      <span>Profile</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button>
                      <Settings />
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
            {/* Chat Area */}
            <main className="flex-1 overflow-auto p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm">Welcome to Soulmate.ai - Your Personal AI Therapist</p>
                </div>
                {/* Chat messages will go here */}
              </div>
            </main>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="max-w-3xl mx-auto flex gap-2">
                <Textarea 
                  placeholder="Type your message here..." 
                  className="min-h-[60px] resize-none"
                />
                <Button>Send</Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
