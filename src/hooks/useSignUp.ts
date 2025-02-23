
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { handleAuthError } from "@/utils/auth-utils";
import { useProfile } from "./useProfile";
import type { SignUpData } from "@/types/auth";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { updateUserProfile } = useProfile();

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
          });
          return false;
        }
        throw error;
      }

      // If sign up is successful and we have a user, update their profile
      if (authData.user) {
        await updateUserProfile(authData.user.id, {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dob
        });

        toast({
          title: "Account created successfully! 📧",
          description: "We've sent you a confirmation email. Please check your inbox and click the verification link to activate your account.",
          duration: 6000, // Show for longer duration since it's an important message
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
