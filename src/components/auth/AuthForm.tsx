import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, handleAuthError, handleAuthSuccess } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";
import { OTPForm } from "./OTPForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { SignUpForm } from "./SignUpForm";

interface AuthFormProps {
  isSignIn: boolean;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isSignIn,
  onToggleMode
}: AuthFormProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const handleBack = () => {
    setOtpSent(false);
    setIsResettingPassword(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Send OTP for verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email
      });
      
      if (otpError) throw otpError;
      
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }) => {
    setIsLoading(true);

    try {
      // Check if user already exists in profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', data.email);

      if (profiles && profiles.length > 0) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in.",
          variant: "destructive"
        });
        onToggleMode();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dob
          }
        }
      });
      
      if (error) throw error;
      
      setOtpSent(true);
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (otp: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: isResettingPassword ? 'recovery' : 'signup'
      });

      if (error) throw error;

      if (isResettingPassword) {
        setIsResettingPassword(true);
        setOtpSent(false);
        toast({
          title: "OTP Verified",
          description: "Please enter your new password",
        });
      } else {
        handleAuthSuccess(isSignIn, toast);
        navigate('/chatbot');
      }
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      setIsResettingPassword(true);
      setOtpSent(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for the password reset code",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (newPassword: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset. Please sign in.",
      });
      setIsResettingPassword(false);
      onToggleMode();
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  if (otpSent) {
    return <OTPForm 
      onSubmit={handleOtpVerification} 
      isLoading={isLoading}
      onBack={handleBack}
    />;
  }

  if (isResettingPassword && !otpSent) {
    return <PasswordResetForm onSubmit={handleNewPassword} isLoading={isLoading} />;
  }

  if (!isSignIn) {
    return (
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

  return (
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
