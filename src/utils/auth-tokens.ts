
import { supabase } from "@/integrations/supabase/client";

/**
 * Retrieves the current user's access token from Supabase auth session
 * @returns Promise<string | null> The access token if available, null otherwise
 */
export const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    console.error("Failed to get session:", error);
    return null;
  }
  return data.session.access_token;
};
