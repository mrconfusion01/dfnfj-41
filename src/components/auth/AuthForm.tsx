
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, handleAuthError, handleAuthSuccess, handlePasswordReset } from "@/utils/auth-utils";
import { Link, useNavigate } from "react-router-dom";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
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

    if (!isSignIn && password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
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
        // Check if user exists and sign in
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
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
      } else {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('profiles')
          .select()
          .eq('email', email)
          .single();

        if (existingUser) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in.",
            variant: "destructive"
          });
          onToggleMode();
          return;
        }

        // Create new account
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
        
        setOtpSent(true);
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account",
        });
      }
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: isResettingPassword ? 'recovery' : 'signup'
      });

      if (error) throw error;

      if (isResettingPassword) {
        // After OTP verification for password reset
        setIsResettingPassword(true);
        setOtpSent(false);
        toast({
          title: "OTP Verified",
          description: "Please enter your new password",
        });
      } else {
        // After OTP verification for login/signup
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

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    return (
      <form onSubmit={handleOtpSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Enter verification code
          </h2>
          <p className="text-sm text-gray-600">
            Please enter the verification code sent to your email
          </p>
        </div>

        <Input
          type="text"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          placeholder="Enter code"
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />

        <Button
          type="submit"
          className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    );
  }

  if (isResettingPassword && !otpSent) {
    return (
      <form onSubmit={handleNewPasswordSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Set new password
          </h2>
          <p className="text-sm text-gray-600">
            Please enter your new password
          </p>
        </div>

        <Input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="New password"
          className="h-9 rounded-full bg-white border-gray-300 text-sm"
          required
        />

        <Button
          type="submit"
          className="w-full h-9 rounded-full bg-primary hover:bg-primary-hover text-white text-sm"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white rounded-2xl shadow-lg p-8">
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
                required
              />
              <Input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
                className="h-9 rounded-full bg-white border-gray-300 text-sm"
                required
              />
            </div>
            <Input
              type="date"
              value={dob}
              onChange={e => setDob(e.target.value)}
              className="h-9 rounded-full bg-white border-gray-300 text-sm"
              required
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

        {!isSignIn && (
          <Input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className="h-9 rounded-full bg-white border-gray-300 text-sm"
            required
          />
        )}
        
        {isSignIn && (
          <button
            type="button"
            onClick={handlePasswordReset}
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
    </form>
  );
};
