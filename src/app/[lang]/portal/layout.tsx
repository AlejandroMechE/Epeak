import React from "react";
import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";
import PortalSidebar from "@/components/Portal/PortalSidebar";
import styles from "./PortalLayout.module.css";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${lang}/login`);
  }

  const userRole = user.user_metadata?.role;

  return (
    <div className={styles.layout}>
      <PortalSidebar lang={lang} dict={dict} role={userRole} />
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
