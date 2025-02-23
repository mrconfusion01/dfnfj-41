
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/types/auth";

export const useProfile = () => {
  const { toast } = useToast();

  const updateUserProfile = async (userId: string, data: Omit<Partial<ProfileData>, 'id'>) => {
    try {
      // First check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Email confirmation required",
          description: "Please check your inbox and confirm your email address to continue.",
          variant: "destructive",
        });
        throw new Error("Please confirm your email to continue");
      }

      // Verify the user is updating their own profile
      if (session.session.user.id !== userId) {
        throw new Error("Unauthorized to update this profile");
      }

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

    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Action required",
        description: error.message,
        variant: "destructive",
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
          title: "Email confirmation required",
          description: "Please check your inbox and confirm your email address to continue.",
          variant: "destructive",
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
        title: "Action required",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return { updateUserProfile, getUserProfile };
};
