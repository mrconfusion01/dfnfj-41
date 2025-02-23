
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OAuthButtons } from "./OAuthButtons";

interface SignInFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onPasswordReset: (e: React.MouseEvent) => Promise<void>;
  onToggleMode: () => void;
  signInWithGoogle: () => Promise<void>;
  isLoading: boolean;
}

export const SignInForm = ({
  onSignIn,
  onPasswordReset,
  onToggleMode,
  signInWithGoogle,
  isLoading
}: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSignIn(email, password);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-600">
              New to soulmate.ai?{" "}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-9 rounded-full bg-white border-gray-300 text-sm"
              required
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-9 rounded-full bg-white border-gray-300 text-sm"
              required
            />

            <button
              type="button"
              onClick={onPasswordReset}
              className="text-sm text-primary hover:underline font-medium block w-full text-right"
            >
              Forgot password?
            </button>

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
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          
          <OAuthButtons onGoogleSignIn={signInWithGoogle} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
