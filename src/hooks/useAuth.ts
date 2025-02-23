
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, handleAuthError, handleAuthSuccess } from "@/utils/auth-utils";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { toast } = useToast();

  const updateUserProfile = async (userId: string, data: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    email?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: data.email || '',
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/chatbot`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (signInError) throw signInError;
    } catch (error: any) {
      handleAuthError(error, toast);
    }
  };

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        handleAuthSuccess(true, toast);
        navigate('/chatbot');
      }
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
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (error) throw error;

      // If sign up is successful and we have a user, update their profile
      if (authData.user) {
        await updateUserProfile(authData.user.id, {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dob
        });

        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
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
    setIsResettingPassword,
    signInWithGoogle
  };
};
