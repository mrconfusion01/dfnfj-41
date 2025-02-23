
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

export const handleAuthError = (error: any, toast: ReturnType<typeof useToast>["toast"]) => {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
};

export const handleAuthSuccess = (
  isSignIn: boolean,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  toast({
    title: isSignIn ? "Welcome back!" : "Welcome!",
    description: isSignIn ? "Successfully signed in" : "Account created successfully",
  });
};
