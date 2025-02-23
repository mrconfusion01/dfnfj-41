
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthSuccess } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";

export const useOTPVerification = (isResettingPassword: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiryTime, setOtpExpiryTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(300);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (otpSent && timeRemaining > 0) {
      // Start the countdown immediately
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(intervalId);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [otpSent, otpExpiryTime]);

  const sendOTP = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) throw error;

      // Reset the timer to 5 minutes (300 seconds)
      setTimeRemaining(300);
      setOtpExpiryTime(new Date(Date.now() + 5 * 60 * 1000));
      setOtpSent(true);
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: isResettingPassword ? 'recovery' : 'signup'
      });

      if (error) {
        toast({
          title: "Invalid code",
          description: "Please check the code and try again",
          variant: "destructive",
        });
        return false;
      }

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
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Please check the code and try again",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    verifyOtp,
    sendOTP,
    isLoading,
    otpSent,
    setOtpSent,
    timeRemaining,
    formatTimeRemaining
  };
};
