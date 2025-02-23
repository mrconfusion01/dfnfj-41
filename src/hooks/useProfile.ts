
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/types/auth";
import { pendingProfiles } from "./useSignUp";

export const useProfile = () => {
  const { toast } = useToast();

  const updateUserProfile = async (userId: string, data: Omit<Partial<ProfileData>, 'id'>) => {
    try {
      // First check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Confirmation email sent! 📧",
          description: "Please check your inbox and confirm your email address to continue.",
        });
        throw new Error("Please confirm your email to continue");
      }

      // Check if email is verified
      if (!session.session.user.email_confirmed_at) {
        toast({
          title: "Email not verified",
          description: "Please verify your email address before updating your profile.",
          variant: "destructive",
        });
        throw new Error("Email not verified");
      }

      // Verify the user is updating their own profile
      if (session.session.user.id !== userId) {
        throw new Error("Unauthorized to update this profile");
      }

      // Check if there are pending profile details
      const pendingDetails = pendingProfiles.get(userId);
      if (pendingDetails) {
        // If we have pending details and email is verified, create the profile
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            ...pendingDetails,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (error) throw error;

        // Clear the pending details after successful creation
        pendingProfiles.delete(userId);
        
        toast({
          title: "Profile created",
          description: "Your account has been fully activated",
        });
      } else {
        // Handle regular profile updates
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', userId)
          .single();

        if (!currentProfile?.email) {
          throw new Error("Could not find existing profile");
        }

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: currentProfile.email,
            ...data,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          });

        if (error) throw error;

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated",
        });
      }

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Action needed",
        description: error.message,
      });
      throw error;
    }
  };

  const getUserProfile = async (userId: string): Promise<ProfileData | null> => {
    try {
      // First check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Confirmation email sent! 📧",
          description: "Please check your inbox and confirm your email address to continue.",
        });
        throw new Error("Please confirm your email to continue");
      }

      // Verify the user is fetching their own profile
      if (session.session.user.id !== userId) {
        throw new Error("Unauthorized to fetch this profile");
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Action needed",
        description: error.message,
      });
      return null;
    }
  };

  return { updateUserProfile, getUserProfile };
};
