
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

  return <div className="min-h-screen bg-gradient-to-br from-rose-400/20 via-purple-400/20 to-cyan-400/20 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-40 w-64 h-64 bg-rose-400/20 rounded-full blur-3xl" />
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
            <Heart className="w-6 h-6 text-purple-500" />
            {!isMobile && <span className="font-semibold text-gray-900">soulmate.ai</span>}
          </div>
        </div>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 text-white text-sm hover:bg-black/70 transition-colors">
          <Github className="w-4 h-4" />
          GitHub Repo
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
                <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Share your thoughts..." className="w-full h-12 pl-4 pr-12 text-base rounded-full bg-white/30 backdrop-blur-md border-white/30 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
            </form>
          </div> : <div className="pt-24 space-y-6 pb-24">
            {messages.map(message => <div key={message.id} className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${message.isAi ? "bg-white/50 backdrop-blur-sm text-gray-800" : "bg-purple-500 text-white"}`}>
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
                <Input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Share your thoughts..." className="w-full h-10 pl-4 pr-12 text-base rounded-full bg-white/30 backdrop-blur-md border-white/30 text-gray-800 placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center hover:bg-purple-600 transition-colors">
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

