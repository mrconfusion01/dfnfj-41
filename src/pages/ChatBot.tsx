
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Github, MessageSquare, User, Menu, X, Heart, Plus, ArrowDown, Square } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/useProfile";
import type { ProfileData } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/hooks/useChat";

const welcomeMessages = ["Hey! How's your day today?", "Hey! How are you feeling today?", "Hi there! Want to talk about your day?", "Hello! Need someone to talk to?", "Hi! Share your thoughts with me"];

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [welcomeMessage] = useState(() => welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const { 
    messages, 
    sessions, 
    currentSessionId, 
    isLoading, 
    sendMessage, 
    loadSession, 
    startNewSession, 
    fetchSessions 
  } = useChat();

  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { fetchProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const profile = await fetchProfile(user.id);
        setUserProfile(profile);
        fetchSessions();
      }
    };
    loadUserProfile();
  }, [fetchProfile, fetchSessions]);

  // Add handler for starting new chat
  const handleStartNewChat = () => {
    startNewSession();
    setIsConversationMode(false);
    setPrompt("");
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const checkScroll = () => {
      const container = chatContainerRef.current;
      if (!container) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
      setShowScrollButton(!isAtBottom);
    };
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
      }
    };
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    const userMessage = prompt.trim();
    setIsConversationMode(true);
    setPrompt("");
    setTimeout(scrollToBottom, 100);
    
    await sendMessage(userMessage);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30">
      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent className="bg-gray-50 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Authentication Required</AlertDialogTitle>
            <AlertDialogDescription>
              To continue chatting with soulmate.ai, please log in or create an account. Your conversations will be saved securely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowAuthDialog(false);
                navigate('/auth');
              }}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Log in / Sign up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div ref={sidebarRef} className={`fixed top-0 left-0 h-full w-64 bg-white/20 backdrop-blur-xl shadow-lg transform transition-transform duration-300 ease-in-out border border-white/20 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-50`}>
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {userProfile ? (
            <>
              <button 
                onClick={handleStartNewChat} 
                className="w-full mb-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Chat</span>
              </button>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadSession(session.id)}
                    className={`p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors ${
                      currentSessionId === session.id ? 'bg-white/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{session.session_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(session.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <MessageSquare className="w-12 h-12 text-blue-500 mb-4" />
              <p className="text-gray-600 mb-4">Sign in to view and manage your chat history</p>
              <button
                onClick={() => navigate('/auth')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login / Sign up
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/10">
          {userProfile ? (
            <>
              <div className="mb-4 p-3 flex items-center gap-3 border-b border-white/20 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{userProfile.first_name || 'User'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 p-3 hover:bg-white/10 rounded-lg cursor-pointer text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="flex w-full items-center gap-3 p-3 hover:bg-white/10 rounded-lg cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-sm font-medium">Login / Sign up</span>
            </button>
          )}
        </div>
      </div>

      <header className="fixed top-4 left-0 right-0 z-40 bg-transparent">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mx-4 px-4 py-3 bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={toggleSidebar} className="p-2 hover:bg-white/20 rounded-lg mr-2 lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-gray-900">soulmate.ai</span>
              </div>
            </div>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 text-white text-sm hover:bg-black/70 transition-colors">
              <Github className="w-4 h-4" />
              {!isMobile && "GitHub Repo"}
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl min-h-screen pt-24">
        {!isConversationMode ? <div className="flex-1 flex items-center justify-center flex-col min-h-[calc(100vh-8rem)]">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800 animate-[fade-in_0.5s_ease-out,scale-in_0.3s_ease-out] opacity-0 [animation-fill-mode:forwards] [animation-delay:0.2s]">
                {welcomeMessage}
              </h1>
              <p className="text-gray-600 text-lg animate-[fade-in_0.5s_ease-out] opacity-0 [animation-fill-mode:forwards] [animation-delay:0.4s]">
                Your Mental Therapist
              </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="relative">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full h-12 pl-4 pr-12 text-base rounded-full bg-white/30 backdrop-blur-md border-white/30 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>
          </div> : <div className="relative h-[calc(100vh-8rem)]">
            <div ref={chatContainerRef} className="absolute inset-0 overflow-y-auto space-y-6 pb-24 pr-1 scroll-smooth">
              <div className="space-y-6 mr-2">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'assistant' ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${message.role === 'assistant' ? "bg-white/50 backdrop-blur-sm text-gray-800" : "bg-blue-500 text-white"}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-800">
                      <span className="animate-pulse">Mira is typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto">
              {showScrollButton && (
                <button onClick={scrollToBottom} className="absolute -top-12 right-4 p-2 rounded-full text-white shadow-lg transition-colors bg-zinc-900 hover:bg-zinc-800">
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}

              <form onSubmit={handleSubmit} className="relative">
                <div className="relative rounded-2xl bg-white/20 backdrop-blur-md p-3">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={isLoading ? "Wait for Mira to finish..." : "Share your thoughts..."}
                    disabled={isLoading}
                    className="w-full h-12 pl-4 pr-12 text-base rounded-xl bg-transparent border-none text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type={isLoading ? "button" : "submit"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z" />
                        <path d="M22 2 11 13" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          .overflow-y-auto::-webkit-scrollbar {
            width: 4px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }
        `
      }} />
    </div>
  );
}
