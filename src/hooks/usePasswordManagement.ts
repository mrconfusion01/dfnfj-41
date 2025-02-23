
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      setIsResettingPassword(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for the password reset code",
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
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

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
    updatePassword,
    isLoading,
    isResettingPassword,
    setIsResettingPassword
  };
};
