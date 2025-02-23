import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, MessageSquare, User, Menu, X, Heart, Plus, ArrowDown, Square } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const welcomeMessages = ["Hey! How's your day today?", "Hey! How are you feeling today?", "Hi there! Want to talk about your day?", "Hello! Need someone to talk to?", "Hi! Share your thoughts with me"];

interface Message {
  id: number;
  content: string;
  isAi: boolean;
}

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("llama-3.1-405b");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [welcomeMessage] = useState(() => welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamedText, setCurrentStreamedText] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHistory] = useState([{
    id: 1,
    title: "Previous Session",
    date: "2 hours ago"
  }, {
    id: 2,
    title: "Anxiety Discussion",
    date: "Yesterday"
  }, {
    id: 3,
    title: "Weekly Check-in",
    date: "2 days ago"
  }]);

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
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateStreamingResponse = async (response: string) => {
    setIsTyping(true);
    setCurrentStreamedText("");
    for (let i = 0; i < response.length; i++) {
      if (!isTyping) break;
      await new Promise(resolve => setTimeout(resolve, 30));
      setCurrentStreamedText(prev => prev + response[i]);
    }
    if (isTyping) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: response,
        isAi: true
      }]);
    }
    setIsTyping(false);
    setCurrentStreamedText("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isTyping) return;
    setIsConversationMode(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: prompt,
      isAi: false
    }]);
    setPrompt("");
    const response = "I understand how you're feeling. It's completely normal to experience these emotions. Would you like to tell me more about what's been on your mind?";
    await simulateStreamingResponse(response);
  };

  const stopResponse = () => {
    setIsTyping(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setIsConversationMode(false);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  return <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-pattern opacity-5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/40 to-cyan-300/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/40 to-pink-300/40 rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-64 h-64 bg-gradient-to-br from-indigo-400/40 to-blue-300/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-gradient-to-br from-pink-400/40 to-rose-300/40 rounded-full blur-3xl" />
      </div>

      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white/20 backdrop-blur-xl shadow-lg transform transition-transform duration-300 ease-in-out border border-white/20 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-50`}
      >
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full mb-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
          <div className="space-y-4">
            {chatHistory.map(chat => <div key={chat.id} className="p-3 hover:bg-white/10 rounded-lg cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{chat.title}</p>
                    <p className="text-xs text-gray-500">{chat.date}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 bg-white/10">
          <div className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg cursor-pointer">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">Profile</span>
          </div>
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
        {!isConversationMode ? (
          <div className="flex-1 flex items-center justify-center flex-col min-h-[calc(100vh-8rem)]">
            <div className="text-center space-y-6 mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
                {welcomeMessage}
              </h1>
              <p className="text-gray-600 text-lg">
                Your Mental Therapist
              </p>
            </div>
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
              <div className="relative">
                <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Share your thoughts..." className="w-full h-12 pl-4 pr-12 text-base rounded-full bg-white/30 backdrop-blur-md border-white/30 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="relative h-[calc(100vh-8rem)]">
            <div ref={chatContainerRef} className="absolute inset-0 overflow-y-auto space-y-6 pb-24 pr-1">
              <div className="space-y-6 mr-2">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${message.isAi ? "bg-white/50 backdrop-blur-sm text-gray-800" : "bg-blue-500 text-white"}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-800">
                      {currentStreamedText}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            <div className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative rounded-2xl bg-white/20 backdrop-blur-md p-3">
                  <Input 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                    placeholder={isTyping ? "Wait for AI to finish..." : "Share your thoughts..."} 
                    disabled={isTyping}
                    className="w-full h-12 pl-4 pr-12 text-base rounded-xl bg-transparent border-none text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50" 
                  />
                  <button 
                    type={isTyping ? "button" : "submit"}
                    onClick={isTyping ? stopResponse : undefined}
                    disabled={isTyping && !currentStreamedText}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isTyping ? (
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

              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute -top-12 right-4 p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}
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
    </div>;
}
