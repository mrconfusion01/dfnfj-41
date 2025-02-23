
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
      // First check if user already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (existingUser?.user) {
        toast({
          title: "Account already exists",
          description: "Please sign in instead",
          variant: "destructive",
        });
        navigate('/auth', { state: { isSignIn: true } });
        return false;
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        // Special handling for "User already registered" error
        if (error.message.includes("already registered")) {
          toast({
            title: "Account already exists",
            description: "Please sign in instead",
            variant: "destructive",
          });
          navigate('/auth', { state: { isSignIn: true } });
          return false;
        }
        throw error;
      }

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
