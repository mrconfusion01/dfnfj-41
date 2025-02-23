
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ChatBot() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("llama-3.1-405b");
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to continue",
        variant: "destructive",
      });
      return;
    }
    // Handle prompt submission here
    console.log("Submitting prompt:", prompt);
    console.log("Selected model:", model);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FF] via-[#F1F0FB] to-[#E5DEFF]">
      {/* Header */}
      <header className="w-full px-4 py-3 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-2">
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

      {/* Main Content */}
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
