
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError } from "@/utils/auth-utils";

export const usePasswordManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
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
      // Send OTP via email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`
      });
      
      if (error) throw error;
      
      toast({
        title: "Code sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndUpdatePassword = async (email: string, otp: string, newPassword: string) => {
    setIsLoading(true);

    try {
      // First verify the OTP
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'recovery'
      });

      if (verifyError) throw verifyError;

      if (!data.session) {
        throw new Error("Session not created after OTP verification");
      }

      // After OTP verification, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset. Please sign in.",
      });
      setIsResettingPassword(false);
      return true;
    } catch (error: any) {
      handleAuthError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    updatePassword: verifyOtpAndUpdatePassword,
    isLoading,
    isResettingPassword,
    setIsResettingPassword
  };
};
