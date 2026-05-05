"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProjectApproval(projectId: string, status: 'approved' | 'declined', reason?: string) {
  const supabase = await createClient();

  // 1. Verify Admin Status
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser || adminUser.user_metadata?.role !== 'admin') {
    throw new Error("Unauthorized: Admin privileges required.");
  }

  // 2. Update Project
  // If approved, move to Architecture. If declined, keep in Review but mark status.
  const updateData: any = {
    approval_status: status,
    rejection_reason: reason || null
  };

  if (status === 'approved') {
    updateData.status = 'Architecture';
  }

  const { error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", projectId);

  if (error) {
    console.error("Project approval update failure:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  return { success: true };
}
