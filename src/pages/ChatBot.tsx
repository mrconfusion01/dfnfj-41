import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, MessageSquare, User, Menu, X, Heart } from "lucide-react";
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
  const isMobile = useIsMobile();
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

  const simulateStreamingResponse = async (response: string) => {
    setIsTyping(true);
    setCurrentStreamedText("");
    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setCurrentStreamedText(prev => prev + response[i]);
    }
    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: response,
      isAi: true
    }]);
    setCurrentStreamedText("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return <div className="min-h-screen bg-gradient-to-br from-indigo-400/30 via-purple-400/30 to-pink-400/30 relative">
      <div className="absolute inset-0 -z-10">
        {/* Enhanced Topographic Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.4),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]" style={{
          backgroundSize: '20px 20px'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v50H0z' fill='rgba(255,255,255,0.03)'/%3E%3Cpath d='M0 50h100v25H0z' fill='rgba(255,255,255,0.02)'/%3E%3Cpath d='M0 75h100v15H0z' fill='rgba(255,255,255,0.01)'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px'
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239fa8da' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
        
        {/* Enhanced Gradient Blobs with Topographic Overlay */}
        <div className="absolute top-20 left-20 w-72 h-72">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-cyan-300/40 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] rounded-full" />
        </div>
        <div className="absolute bottom-20 right-20 w-96 h-96">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-pink-300/40 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] rounded-full" />
        </div>
        <div className="absolute top-40 right-40 w-64 h-64">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/40 to-blue-300/40 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] rounded-full" />
        </div>
        <div className="absolute bottom-40 left-40 w-80 h-80">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/40 to-rose-300/40 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] rounded-full" />
        </div>
      </div>

      <div className={`fixed top-0 left-0 h-full w-64 bg-white/20 backdrop-blur-xl shadow-lg transform transition-transform duration-300 ease-in-out border border-white/20 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} z-50`}>
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
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

      <header className="fixed top-4 left-4 right-4 px-4 py-3 flex items-center justify-between bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm z-40">
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
      </header>

      <main className="container mx-auto px-4 max-w-3xl min-h-screen flex flex-col">
        {!isConversationMode ? <div className="flex-1 flex items-center justify-center flex-col">
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
          </div> : <div className="pt-24 space-y-6 pb-24">
            {messages.map(message => <div key={message.id} className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${message.isAi ? "bg-white/50 backdrop-blur-sm text-gray-800" : "bg-blue-500 text-white"}`}>
                  {message.content}
                </div>
              </div>)}
            {isTyping && <div className="flex justify-start">
                <div className="max-w-[80%] p-4 rounded-2xl bg-white/50 backdrop-blur-sm text-gray-800">
                  {currentStreamedText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>}
          </div>}

        {isConversationMode && <div className="fixed bottom-6 left-4 right-4 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Share your thoughts..." className="w-full h-15 pl-4 pr-12 text-base rounded-full bg-white/30 backdrop-blur-md border-white/30 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>
          </div>}
      </main>
    </div>;
}
