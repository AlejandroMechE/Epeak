"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleUserBan(userId: string, currentStatus: boolean) {
  const supabase = await createClient();

  // 1. Verify Admin Status (Security Rule: Double-check on server)
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser || adminUser.user_metadata?.role !== 'admin') {
    throw new Error("Unauthorized: Admin privileges required.");
  }

  // 2. Prevent banning self
  if (adminUser.id === userId) {
    throw new Error("Self-harm protocol: Admins cannot ban themselves.");
  }

  // 3. Update Profile
  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: !currentStatus })
    .eq("id", userId);

  if (error) {
    console.error("Ban toggle failure:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  return { success: true, newStatus: !currentStatus };
}
