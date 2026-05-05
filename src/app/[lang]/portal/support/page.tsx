import React from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProjectChat from "@/components/Portal/ProjectChat";
import FAQSection from "@/components/Portal/FAQSection";
import styles from "./SupportHub.module.css";

export default async function SupportPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as any);
  const supabase = await createClient();

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/auth/login`);

  const supportDict = dict.portal.support;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{supportDict.title}</h1>
        <p className={styles.subtitle}>{supportDict.subtitle}</p>
      </header>

      <div className={styles.grid}>
        {/* LEFT COLUMN: FAQ ENGINE */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>DATABASE</span>
            <h2 className={styles.sectionTitle}>{supportDict.faq_title}</h2>
          </div>
          <div className={styles.panel}>
            <FAQSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* RIGHT COLUMN: SUPPORT TERMINAL */}
        <section className={styles.chatSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>UPLINK</span>
            <h2 className={styles.sectionTitle}>{supportDict.chat_title}</h2>
          </div>
          <div className={styles.chatContainer}>
            <ProjectChat 
              userId={user.id} 
              projectId={null} 
              lang={lang} 
              isSupport={true} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}
