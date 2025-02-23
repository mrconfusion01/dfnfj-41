
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ProfileData } from "@/types/auth";

export const useProfile = () => {
  const { toast } = useToast();

  const updateUserProfile = async (userId: string, data: Omit<Partial<ProfileData>, 'id'>) => {
    try {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: currentProfile?.email || '', // Ensure email is always present
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
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getUserProfile = async (userId: string): Promise<ProfileData | null> => {
    try {
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
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  return { updateUserProfile, getUserProfile };
};
