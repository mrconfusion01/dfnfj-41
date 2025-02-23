
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, handleAuthError, handleAuthSuccess, handlePasswordReset } from "@/utils/auth-utils";
import { Link } from "react-router-dom";

interface AuthFormProps {
  isSignIn: boolean;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isSignIn,
  onToggleMode
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers",
        variant: "destructive"
      });
      return;
    }

    if (!isSignIn) {
      if (!agreedToTerms) {
        toast({
          title: "Terms agreement required",
          description: "Please agree to the Terms of Service and Privacy Policy",
          variant: "destructive"
        });
        return;
      }

      if (!firstName || !lastName || !dob) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        handleAuthSuccess(true, toast);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              date_of_birth: dob
            }
          }
        });
        if (error) throw error;
        handleAuthSuccess(false, toast);
      }
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password",
        variant: "destructive"
      });
      return;
    }
    await handlePasswordReset(email, toast);
  };

  return <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          {isSignIn ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-sm text-gray-600">
          {isSignIn ? "New to soulmate.ai? " : "Already have an account? "}
          <button type="button" onClick={onToggleMode} className="text-primary hover:underline font-medium">
            {isSignIn ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>

      <Button type="button" variant="outline" className="w-full h-9 rounded-full justify-center gap-2 text-gray-700 hover:text-gray-900 border border-gray-300 text-sm" onClick={async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google'
        });
        if (error) throw error;
      } catch (error: any) {
        handleAuthError(error, toast);
      }
    }}>
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
        </svg>
        <span className="text-sm">
          {isSignIn ? "Sign in with Google" : "Sign up with Google"}
        </span>
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
        {!isSignIn && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First name"
                className="h-9 rounded-full bg-white border-gray-300 text-sm"
                required={!isSignIn}
              />
              <Input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
                className="h-9 rounded-full bg-white border-gray-300 text-sm"
                required={!isSignIn}
              />
            </div>
            <Input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="h-9 rounded-full bg-white border-gray-300 text-sm"
              required={!isSignIn}
            />
          </>
        )}
        
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />
        
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />
        
        {isSignIn && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:underline font-medium block w-full text-right"
          >
            Forgot password?
          </button>
        )}
        
        {!isSignIn && (
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={checked => setAgreedToTerms(checked as boolean)}
              className="mt-1 bg-indigo-300 hover:bg-indigo-200"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              Agree to our{" "}
              <Link to="#" className="text-primary hover:underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link to="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isSignIn ? "Signing in..." : "Creating account..."}
            </span>
          ) : (
            isSignIn ? "Sign in" : "Sign up"
          )}
        </Button>
      </div>
    </form>;
};
