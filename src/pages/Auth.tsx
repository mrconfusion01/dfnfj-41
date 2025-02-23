
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { TypingAnimation } from "@/components/auth/TypingAnimation";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(false);
  const navigate = useNavigate();
  
  const phrases = [
    "Your personal AI therapist, available 24/7",
    "Discover peace of mind through AI-guided therapy",
    "Professional mental support at your fingertips",
    "Begin your journey to better mental health"
  ];

  const handleLogoClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/chatbot');
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
        navigate('/chatbot');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 md:bg-none">
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
        <AuthForm isSignIn={isSignIn} onToggleMode={() => setIsSignIn(!isSignIn)} />
      </div>

      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 flex-col justify-center items-center p-12 text-white">
        <div className="max-w-lg text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8" onClick={handleLogoClick} role="button" style={{ cursor: 'pointer' }}>
            <svg width="40" height="40" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="heartGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#ffffff" }} />
                  <stop offset="100%" style={{ stopColor: "#ffffff" }} />
                </linearGradient>
              </defs>
              <path d="M16 28.72c-.57 0-1.14-.22-1.58-.66L4.66 18.3C1.64 15.28 1.64 10.72 4.66 7.7c3.02-3.02 7.58-3.02 10.6 0l.74.74.74-.74c3.02-3.02 7.58-3.02 10.6 0 3.02 3.02 3.02 7.58 0 10.6l-9.76 9.76c-.44.44-1.01.66-1.58.66z" fill="url(#heartGradientLarge)"/>
            </svg>
            <h1 className="text-3xl lg:text-4xl font-bold">soulmate.ai</h1>
          </div>
          <TypingAnimation phrases={phrases} />
          <p className="text-lg opacity-90">
            Experience compassionate AI therapy, anytime, anywhere
          </p>
        </div>
      </div>
    </div>
  );
}
