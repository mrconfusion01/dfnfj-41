import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPForm } from "./OTPForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { SignUpForm } from "./SignUpForm";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

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
  const {
    isLoading,
    otpSent,
    isResettingPassword,
    signIn,
    signUp,
    verifyOtp,
    resetPassword,
    updatePassword,
    setOtpSent,
    setIsResettingPassword,
    signInWithGoogle
  } = useAuth();

  const handleBack = () => {
    setOtpSent(false);
    setIsResettingPassword(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleSignUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }) => {
    const success = await signUp(data);
    if (!success) {
      onToggleMode();
    }
  };

  const handleOtpVerification = async (otp: string) => {
    await verifyOtp(email, otp);
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    await resetPassword(email);
  };

  const handleNewPassword = async (newPassword: string) => {
    const success = await updatePassword(newPassword);
    if (success) {
      onToggleMode();
    }
  };

  const renderAuthForm = (children: React.ReactNode) => (
    <div className="space-y-6">
      {children}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-9 rounded-full flex items-center justify-center gap-2"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  );

  if (otpSent) {
    return (
      <OTPForm 
        onSubmit={handleOtpVerification} 
        isLoading={isLoading}
        onBack={handleBack}
      />
    );
  }

  if (isResettingPassword && !otpSent) {
    return (
      <PasswordResetForm 
        onSubmit={handleNewPassword} 
        isLoading={isLoading} 
      />
    );
  }

  if (!isSignIn) {
    return renderAuthForm(
      <div className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button type="button" onClick={onToggleMode} className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
        <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} />
      </div>
    );
  }

  return renderAuthForm(
    <form onSubmit={handleSignIn} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-600">
          New to soulmate.ai?{" "}
          <button type="button" onClick={onToggleMode} className="text-primary hover:underline font-medium">
            Create an account
          </button>
        </p>
      </div>

      <div className="space-y-4">
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
        
        <button
          type="button"
          onClick={handlePasswordReset}
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
      </div>
    </form>
  );
};
