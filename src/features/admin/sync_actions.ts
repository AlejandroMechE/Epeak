"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function syncAdminProfile() {
  const supabase = await createClient();

  // 1. Get current auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Auth session expired.");

  // 2. Upsert the current user into profiles to ensure they exist
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      user_metadata: user.user_metadata,
      role: user.user_metadata?.role || 'admin',
      is_banned: false
    });

  if (profileError) {
    console.error("Sync Error:", profileError);
    throw new Error("Could not sync profile: " + profileError.message);
  }

  revalidatePath("/admin");
  return { success: true };
}
