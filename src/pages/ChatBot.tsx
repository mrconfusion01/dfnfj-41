
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Github, MessageSquare, User, Menu, X } from "lucide-react";

export default function ChatBot() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("llama-3.1-405b");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory] = useState([
    { id: 1, title: "Calculator App", date: "2 hours ago" },
    { id: 2, title: "Todo List", date: "Yesterday" },
    { id: 3, title: "Weather App", date: "2 days ago" },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      return;
    }
    // Handle prompt submission here
    console.log("Submitting prompt:", prompt);
    console.log("Selected model:", model);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FF] via-[#F1F0FB] to-[#E5DEFF]">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-50`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{chat.title}</p>
                    <p className="text-xs text-gray-500">{chat.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">Profile</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg mr-2 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-semibold">L</span>
          </div>
          <span className="font-semibold text-gray-900">LlamaCoder</span>
        </div>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
        >
          <Github className="w-4 h-4" />
          GitHub Repo
        </a>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold tracking-tight">
            Turn your{" "}
            <span className="text-blue-500">idea</span>
            <br />
            into a{" "}
            <span className="text-blue-500">prompt</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Powered by Llama 3.1 and Together AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Build me a calculator app..."
              className="w-full h-[120px] p-6 text-lg rounded-2xl bg-white border-gray-200 resize-none"
              style={{ paddingRight: "3.5rem" }}
            />
            <button 
              type="submit" 
              className="absolute right-4 bottom-4 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </button>
          </div>

          <Select
            value={model}
            onValueChange={setModel}
          >
            <SelectTrigger className="w-[200px] mx-auto bg-white">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="llama-3.1-405b">Llama 3.1 405B</SelectItem>
              <SelectItem value="llama-3.1-70b">Llama 3.1 70B</SelectItem>
              <SelectItem value="llama-3.1-34b">Llama 3.1 34B</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </main>
    </div>
  );
}
