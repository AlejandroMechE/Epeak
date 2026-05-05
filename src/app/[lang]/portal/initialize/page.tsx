import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";
import PackageWizard from "@/components/Sales/PackageWizard";
import PortalHeader from "@/components/Portal/PortalHeader";
import styles from "./Initialize.module.css";

export default async function InitializePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${lang}/login`);
  }

  return (
    <div className={styles.pageCenter}>
      <div className={styles.titleWrapper}>
        <PortalHeader title={dict.portal.wizard.header_title} />
      </div>
      
      <main className={styles.wizardWrapper} style={{ marginTop: '1rem' }}>
        <PackageWizard lang={lang} dict={dict} showSidebar={false} />
      </main>
    </div>
  );
}
