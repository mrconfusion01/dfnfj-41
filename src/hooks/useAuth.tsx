
import { useSignIn } from "./useSignIn";
import { useSignUp } from "./useSignUp";
import { usePasswordManagement } from "./usePasswordManagement";
import { useOTPVerification } from "./useOTPVerification";
import { useProfile } from "./useProfile";

export const useAuth = () => {
  const { 
    signIn, 
    signInWithGoogle, 
    verifyOTP: verifySignInOTP,
    isLoading: isSignInLoading,
    requiresOTP,
    setRequiresOTP 
  } = useSignIn();
  const { signUp, isLoading: isSignUpLoading } = useSignUp();
  const {
    resetPassword,
    updatePassword,
    isLoading: isPasswordLoading,
    isResettingPassword,
    setIsResettingPassword
  } = usePasswordManagement();
  const {
    verifyOtp,
    sendOTP,
    isLoading: isOtpLoading,
    otpSent,
    setOtpSent,
    timeRemaining,
    formatTimeRemaining
  } = useOTPVerification(isResettingPassword);

  return {
    signIn,
    signInWithGoogle,
    signUp,
    resetPassword,
    updatePassword,
    verifyOtp,
    verifySignInOTP,
    sendOTP,
    isLoading: isSignInLoading || isSignUpLoading || isPasswordLoading || isOtpLoading,
    otpSent,
    setOtpSent,
    isResettingPassword,
    setIsResettingPassword,
    requiresOTP,
    setRequiresOTP,
    timeRemaining,
    formatTimeRemaining
  };
};
