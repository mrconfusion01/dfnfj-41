
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError } from "@/utils/auth-utils";
import { useProfile } from "./useProfile";
import { useNavigate } from "react-router-dom";
import type { SignUpData } from "@/types/auth";

// Create a temporary storage for pending user details
export const pendingProfiles = new Map<string, Omit<SignUpData, 'password'>>();

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateUserProfile } = useProfile();
  const navigate = useNavigate();

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);

    try {
      // Check if email exists without attempting to sign in
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('email', data.email);

      if (count && count > 0) {
        toast({
          title: "Email already registered",
          description: "Please sign in with your existing account",
          variant: "destructive",
        });
        setIsLoading(false);
        navigate('/auth', { state: { isSignIn: true } });
        return false;
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;

      // If sign up is successful, store the user details temporarily
      if (authData.user) {
        // Store user details (excluding password) in temporary storage
        const { password, ...userDetails } = data;
        pendingProfiles.set(authData.user.id, userDetails);

        toast({
          title: "Account created successfully! 📧",
          description: "We've sent you a confirmation email. Please check your inbox and click the verification link to activate your account.",
          duration: 6000,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      handleAuthError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};
