
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";
import { OTPForm } from "./OTPForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface AuthFormProps {
  isSignIn: boolean;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isSignIn,
  onToggleMode
}: AuthFormProps) => {
  const [tempEmail, setTempEmail] = useState<string>("");
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

  const handleSignUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }) => {
    await signUp(data);
  };

  const handleUpdatePassword = async (password: string) => {
    await updatePassword(password);
  };

  const handlePasswordReset = async (email: string) => {
    setTempEmail(email);
    await resetPassword(email);
  };

  if (otpSent) {
    return (
      <OTPForm 
        onSubmit={(otp) => verifyOtp(tempEmail, otp)}
        isLoading={isLoading}
        onBack={handleBack}
      />
    );
  }

  if (isResettingPassword && !otpSent) {
    return (
      <PasswordResetForm 
        onSubmit={handleUpdatePassword}
        isLoading={isLoading}
      />
    );
  }

  if (!isSignIn) {
    return <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} onToggleMode={onToggleMode} />;
  }

  return (
    <SignInForm
      onSignIn={signIn}
      onPasswordReset={handlePasswordReset}
      onToggleMode={onToggleMode}
      signInWithGoogle={signInWithGoogle}
      isLoading={isLoading}
    />
  );
};
