
import { supabase } from "@/integrations/supabase/client";

export const useProfile = () => {
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

  return { updateUserProfile };
};
