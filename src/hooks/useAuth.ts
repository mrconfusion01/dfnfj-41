
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, handleAuthError, handleAuthSuccess } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email
      });
      
      if (otpError) throw otpError;
      
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
  }) => {
    setIsLoading(true);

    try {
      const { data: existingProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', data.email);

      if (profileError) throw profileError;

      if (existingProfiles && existingProfiles.length > 0) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please sign in.",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            date_of_birth: data.dob
          }
        }
      });
      
      if (error) throw error;
      
      setOtpSent(true);
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify your account",
      });
      return true;
    } catch (error: any) {
      handleAuthError(error, toast);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: isResettingPassword ? 'recovery' : 'signup'
      });

      if (error) throw error;

      if (isResettingPassword) {
        setIsResettingPassword(true);
        setOtpSent(false);
        toast({
          title: "OTP Verified",
          description: "Please enter your new password",
        });
      } else {
        handleAuthSuccess(true, toast);
        navigate('/chatbot');
      }
    } catch (error: any) {
      handleAuthError(error, toast);
    } finally {
      setIsLoading(false);
    }
  };

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
      setOtpSent(true);
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
    isLoading,
    otpSent,
    isResettingPassword,
    signIn,
    signUp,
    verifyOtp,
    resetPassword,
    updatePassword,
    setOtpSent,
    setIsResettingPassword
  };
};
