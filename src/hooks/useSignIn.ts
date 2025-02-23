
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

      // Verify if credentials are valid without logging in
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
        query: email
      });

      if (userError) throw userError;

      if (!users || users.length === 0) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password",
          variant: "destructive",
        });
        return false;
      }

      // Send reauthentication OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false // Ensures this is for reauthentication only
        }
      });

      if (otpError) throw otpError;

      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });

      // Navigate to OTP verification page with email and password
      navigate('/auth/verify', { state: { email, password } });
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
      // First verify the reauthentication OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (verifyError) throw verifyError;

      // After OTP is verified, perform the actual login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      toast({
        title: "Success",
        description: "Successfully verified and signed in",
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
