"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { i18n } from "@/i18n/config";

/**
 * Validates and retrieves the locale from the request path or defaults to i18n.defaultLocale.
 */
function getLocale(pathname?: string): string {
  if (!pathname) return i18n.defaultLocale;
  const segments = pathname.split("/");
  const locale = segments[1];
  return i18n.locales.includes(locale as any) ? locale : i18n.defaultLocale;
}

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
  message?: string;
};

import { LoginSchema, RegisterSchema } from "./schemas";

export async function signIn(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const result = LoginSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { email, password } = result.data;
  let next = (formData.get("next") as string) || "/portal";
  const locale = getLocale(next);

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "AUTH_INVALID_CREDENTIALS" };
  }

  // Role-aware redirection (Architect's Rule: Admins pivot to Control Center)
  const role = data.user?.user_metadata?.role;
  if (role === 'admin') {
    // If we're going to a standard page or portal, pivot to admin
    if (next.includes('/portal') || next === `/${locale}` || next === '/') {
      next = `/${locale}/admin`;
    }
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : `/${locale}${next}`);
}

export async function signUp(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const result = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { email, password, fullName } = result.data;
  const packageDetailsStr = formData.get("packageDetails") as string;
  const locale = formData.get("locale") as string || i18n.defaultLocale;

  let packageDetails = null;
  if (packageDetailsStr) {
    try {
      packageDetails = JSON.parse(packageDetailsStr);
    } catch (e) {
      console.error("Failed to parse package details", e);
    }
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        package_details: packageDetails,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/${locale}/portal`,
    },
  });

  if (error) {
    if (error.message.includes("already registered") || error.status === 422) {
      return { error: "AUTH_EMAIL_EXISTS" };
    }
    return { error: error.message };
  }

  // Supabase "Secure email" check: if identities is empty, user already exists
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "AUTH_EMAIL_EXISTS" };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/verify-email?email=${encodeURIComponent(email)}`);
}

import { ForgotPasswordSchema } from "./schemas";

export async function requestPasswordReset(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const result = ForgotPasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { email } = result.data;
  const locale = formData.get("locale") as string || i18n.defaultLocale;
  const supabase = await createClient();

  // Robust absolute URL construction
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, "");
  const redirectTo = `${siteUrl}/auth/callback?next=/${locale}/update-password`;

  console.log("DEBUG: Requesting password reset with redirectTo:", redirectTo);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Reset link sent successfully." };
}

export async function resendVerificationEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    throw new Error(error.message);
  }
  
  return { success: true };
}

import { UpdatePasswordSchema } from "./schemas";

export async function updatePassword(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const result = UpdatePasswordSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const { password } = result.data;
  const locale = formData.get("locale") as string || i18n.defaultLocale;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(`/${locale}/portal`);
}

export async function signOut(pathname: string) {
  const locale = getLocale(pathname);
  const supabase = await createClient();
  
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect(`/${locale}/login`);
}
