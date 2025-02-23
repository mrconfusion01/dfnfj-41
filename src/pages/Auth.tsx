
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const phrases = [
    "Your personal AI therapist, available 24/7",
    "Discover peace of mind through AI-guided therapy",
    "Professional mental support at your fingertips",
    "Begin your journey to better mental health"
  ];
  
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: number;
    const currentText = phrases[currentPhrase];
    
    if (isDeleting) {
      timer = window.setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length - 1));
      }, typingSpeed / 2);
    } else {
      timer = window.setTimeout(() => {
        setDisplayText(currentText.substring(0, displayText.length + 1));
      }, typingSpeed);
    }

    // Handling the complete cycle of typing and deleting
    if (!isDeleting && displayText === currentText) {
      timer = window.setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(100);
      }, 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      setLoopNum(loopNum + 1);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentPhrase, loopNum, phrases]);
  
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 p-4 md:p-8 lg:p-12 flex items-center justify-center bg-white">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 32 32">
              <defs>
                <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#FF6B6B" }} />
                  <stop offset="50%" style={{ stopColor: "#4ECDC4" }} />
                  <stop offset="100%" style={{ stopColor: "#45B7D1" }} />
                </linearGradient>
              </defs>
              <path d="M16 28.72c-.57 0-1.14-.22-1.58-.66L4.66 18.3C1.64 15.28 1.64 10.72 4.66 7.7c3.02-3.02 7.58-3.02 10.6 0l.74.74.74-.74c3.02-3.02 7.58-3.02 10.6 0 3.02 3.02 3.02 7.58 0 10.6l-9.76 9.76c-.44.44-1.01.66-1.58.66z" fill="url(#heartGradient)"/>
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              soulmate.ai
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-gray-600">
              {isSignIn ? "New to soulmate.ai? " : "Already have an account? "}
              <button 
                onClick={() => setIsSignIn(!isSignIn)}
                className="text-primary hover:underline font-medium"
              >
                {isSignIn ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Social Sign Up Button */}
          <Button 
            variant="outline" 
            className="w-full h-9 rounded-full justify-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 text-sm"
            onClick={() => {}}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor"/>
            </svg>
            {isSignIn ? "Sign in with Google" : "Sign up with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-9 rounded-full bg-white border-gray-300 text-sm"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-9 rounded-full bg-white border-gray-300 text-sm"
            />
            
            {!isSignIn && (
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-xs text-gray-600">
                  I agree to the{" "}
                  <Link to="#" className="text-primary hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
            >
              {isSignIn ? "Sign in" : "Sign up"}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Gradient Background and Content - Only visible on larger screens */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-500 flex-col justify-center items-center p-8 lg:p-12 text-white">
        <div className="max-w-lg text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-8">
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
          <div className="h-16">
            <p className="text-xl lg:text-2xl font-light">
              <span className="inline-block min-h-[2em]">{displayText}</span>
              <span className="animate-pulse">|</span>
            </p>
          </div>
          <p className="text-base lg:text-lg opacity-90">
            Experience compassionate AI therapy, anytime, anywhere
          </p>
        </div>
      </div>
    </div>
  );
}
