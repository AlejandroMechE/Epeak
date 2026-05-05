import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Locale } from "@/i18n/config";
import "./admin.css";

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { lang } = (await params) as { lang: Locale };
  const supabase = await createClient();

  // 1. Verify Authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}/login?next=/${lang}/admin`);
  }

  // 2. Verify Authorization (Role Guard)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    redirect(`/${lang}/portal`);
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-glow" />
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-symbol">◢</span>
            <h1 className="text-gradient-filament">COMMAND CENTER</h1>
          </div>
          <div className="system-status">
            <span className="pulse-dot" />
            <span className="status-label">LIFECYCLE V4 ONLINE</span>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
