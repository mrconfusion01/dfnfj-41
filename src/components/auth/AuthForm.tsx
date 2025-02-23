
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";
import { OTPForm } from "./OTPForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface AuthFormProps {
  isSignIn: boolean;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isSignIn,
  onToggleMode
}: AuthFormProps) => {
  const [tempEmail, setTempEmail] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    setShowConfirmation(false);
  };

  const handleSignUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }) => {
    const result = await signUp(data);
    if (result.success) {
      setTempEmail(result.email);
      setShowConfirmation(true);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    const success = await signIn(email, password);
    if (success) {
      setTempEmail(email);
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    await verifyOtp(tempEmail, otp);
  };

  if (showConfirmation) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-primary"
                >
                  <path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2z"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
              <p className="text-gray-600">
                We've sent a confirmation email to <span className="font-medium">{tempEmail}</span>.
                Please check your inbox and click the verification link to activate your account.
              </p>
            </div>
            <Button
              onClick={handleBack}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign up
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (otpSent) {
    return (
      <OTPForm 
        onSubmit={handleVerifyOtp}
        isLoading={isLoading}
        onBack={handleBack}
      />
    );
  }

  if (isResettingPassword && !otpSent) {
    return (
      <PasswordResetForm 
        onSubmit={updatePassword}
        isLoading={isLoading}
      />
    );
  }

  if (!isSignIn) {
    return <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} onToggleMode={onToggleMode} />;
  }

  return (
    <SignInForm
      onSignIn={handleSignIn}
      onPasswordReset={resetPassword}
      onToggleMode={onToggleMode}
      signInWithGoogle={signInWithGoogle}
      isLoading={isLoading}
    />
  );
};
