
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";
import type { SignUpData } from "@/types/auth";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signUp = async (data: SignUpData) => {
    setIsLoading(true);

    try {
      // Validate email format
      if (!validateEmail(data.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return { success: false };
      }

      // Check if user already exists in auth system
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (existingUser.user) {
        toast({
          title: "Email already registered",
          description: "Please sign in with your existing account",
          variant: "destructive",
        });
        navigate('/auth', { state: { isSignIn: true } });
        return { success: false };
      }

      // Proceed with sign up
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dob
          },
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Please check your email to verify your account",
      });

      return { success: true, email: data.email };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, isLoading };
};
