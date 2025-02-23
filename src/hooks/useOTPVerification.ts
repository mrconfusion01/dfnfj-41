
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError, handleAuthSuccess } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";

export const useOTPVerification = (isResettingPassword: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: isResettingPassword ? 'recovery' : 'signup'
      });

      if (error) throw error;

      if (isResettingPassword) {
        setOtpSent(false);
        toast({
          title: "OTP Verified",
          description: "Please enter your new password",
        });
      } else {
        handleAuthSuccess(true, toast);
        navigate('/chatbot');
      }
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyOtp,
    isLoading,
    otpSent,
    setOtpSent
  };
};
