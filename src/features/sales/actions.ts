"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { ProjectSnapshotSchema } from "./schema";

export async function completeOnboarding() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  // Mandatory Security: Only allow onboarding if email is confirmed
  if (!user.email_confirmed_at) {
    throw new Error("Email not confirmed");
  }

  const packageDetails = user.user_metadata?.package_details;

  if (!packageDetails) {
    // Already onboarded or no package data
    return { success: true, alreadyOnboarded: true };
  }

  // Using the new 'projects' table for onboarding too
  const { error: projectError } = await supabase.from("projects").insert({
    client_id: user.id,
    title: packageDetails.core_offer?.title || "Project Briefing",
    status: "Discovery",
    total_price: packageDetails.financials?.total_price || 0,
    currency: packageDetails.meta?.currency || "MXN",
    payload: packageDetails
  });

  if (projectError) {
    console.error("Project creation error:", projectError);
    throw new Error("Failed to create project");
  }

  // Clear onboarding metadata
  const { error: updateError } = await supabase.auth.updateUser({
    data: { package_details: null }
  });

  if (updateError) console.error("Metadata cleanup error:", updateError);

  revalidatePath("/", "layout");
  return { success: true };
}

export async function createProjectDirectly(payload: any) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("Unauthorized");
  if (!user.email_confirmed_at) throw new Error("Email not confirmed");

  // 1. Validate Payload Integrity via Zod
  console.log("SERVER: Validating Project Snapshot Payload...");
  const validated = ProjectSnapshotSchema.safeParse(payload);
  
  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    console.error("SERVER: Validation Failed:", JSON.stringify(fieldErrors));
    return { 
      success: false, 
      error: "Invalid data structure", 
      details: fieldErrors 
    };
  }

  const snapshot = validated.data;

  // 2. Insert into the new 'projects' table with Snapshotting
  const { data, error: projectError } = await supabase.from("projects").insert({
    client_id: user.id,
    title: snapshot.project_identity.title,
    description: snapshot.intelligence.objective.substring(0, 500),
    status: "Discovery",
    is_active: true,
    total_price: snapshot.financials.total_price,
    currency: snapshot.meta.currency,
    payload: snapshot // The full frozen project brief
  }).select().single();

  if (projectError) {
    console.error("Supabase error:", projectError);
    return { 
      success: false, 
      error: projectError.message,
      code: projectError.code 
    };
  }

  revalidatePath("/", "layout");
  return { success: true, projectId: data.id };
}
