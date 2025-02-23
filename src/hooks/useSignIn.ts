
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/utils/auth-utils";

// Import the constants directly from where they are defined
const SUPABASE_URL = "https://iywsdqzgvmxxohmawjmo.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5d3NkcXpndm14eG9obWF3am1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyODU3NzksImV4cCI6MjA1NTg2MTc3OX0.di8Qy5oeN-u3L6keO60pGv8tCO_l83UAHFUex-ynoVg";

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

      // Use REST endpoint to verify credentials without creating a session
      const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password",
          variant: "destructive",
        });
        return { success: false, requiresOTP: false };
      }

      // Send OTP for verification
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

