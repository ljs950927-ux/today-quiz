import { createClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export type CurrentUser = {
  id: string;
  email: string | null;
  isAnonymous: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!hasSupabaseConfig()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email ?? null,
      isAnonymous: Boolean(data.user.is_anonymous),
    };
  } catch (error) {
    console.error("getCurrentUser failed", error);
    return null;
  }
}
