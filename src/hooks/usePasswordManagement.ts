
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";

export const usePasswordManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // Send OTP instead of password reset email
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });
      
      if (error) throw error;
      
      setIsResettingPassword(true);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setIsLoading(true);

    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session, try to sign in with the new password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: session?.user?.email || '',
          password: newPassword
        });

        if (signInError) throw signInError;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated and you're now logged in.",
      });
      
      setIsResettingPassword(false);
      navigate('/chatbot');
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
    updatePassword,
    isLoading,
    isResettingPassword,
    setIsResettingPassword
  };
};
