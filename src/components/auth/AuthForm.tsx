
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";
import { OTPForm } from "./OTPForm";
import { PasswordResetForm } from "./PasswordResetForm";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
  isSignIn: boolean;
  onToggleMode: () => void;
}

export const AuthForm = ({
  isSignIn,
  onToggleMode
}: AuthFormProps) => {
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

  if (otpSent) {
    return (
      <OTPForm 
        onSubmit={(otp) => verifyOtp(email, otp)}
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
    return <SignUpForm onSubmit={signUp} isLoading={isLoading} onToggleMode={onToggleMode} />;
  }

  return (
    <SignInForm
      onSignIn={signIn}
      onPasswordReset={resetPassword}
      onToggleMode={onToggleMode}
      signInWithGoogle={signInWithGoogle}
      isLoading={isLoading}
    />
  );
};
