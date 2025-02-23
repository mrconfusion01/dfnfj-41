
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/auth-utils";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [requiresOTP, setRequiresOTP] = useState(false);
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
        return { success: false, requiresOTP: false };
      }

      // First, verify the password without creating a session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password",
            variant: "destructive",
          });
        } else {
          throw signInError;
        }
        return { success: false, requiresOTP: false };
      }

      // Password is correct, sign out the user before sending OTP
      await supabase.auth.signOut();

      // Send OTP for second factor authentication
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (otpError) throw otpError;

      setTempEmail(email);
      setRequiresOTP(true);
      
      toast({
        title: "Verification required",
        description: "Please check your email for the verification code",
      });

      return { success: true, requiresOTP: true };

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, requiresOTP: false };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.verifyOtp({
        email: tempEmail,
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("No session created after OTP verification");
      }

      toast({
        title: "Success",
        description: "Successfully signed in",
      });

      // Only navigate after successful OTP verification
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
      setRequiresOTP(false);
    }
  };

  return { 
    signIn, 
    signInWithGoogle, 
    verifyOTP,
    isLoading,
    requiresOTP,
    setRequiresOTP
  };
};
