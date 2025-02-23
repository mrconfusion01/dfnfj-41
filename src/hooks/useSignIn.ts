
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/auth-utils";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chatbot`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      if (!validateEmail(email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return false;
      }

      // Send OTP first
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
      });

      if (otpError) throw otpError;

      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndSignIn = async (email: string, otp: string, password: string) => {
    setIsLoading(true);

    try {
      // First verify OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (verifyError) throw verifyError;

      // If OTP is verified, proceed with password login
      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid credentials",
            description: "Please check your password",
            variant: "destructive",
          });
        } else {
          throw signInError;
        }
        return false;
      }

      if (!data.user) {
        toast({
          title: "Error",
          description: "No user found with this email",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Successfully signed in",
      });

      navigate('/chatbot');
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, verifyOtpAndSignIn, signInWithGoogle, isLoading };
};
