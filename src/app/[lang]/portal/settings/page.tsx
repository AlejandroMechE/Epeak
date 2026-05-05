import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";
import styles from "./SettingsView.module.css";
import PortalHeader from "@/components/Portal/PortalHeader";
import Card from "@/components/ui/Card/Card";
import SettingsControls from "@/components/Portal/SettingsControls";

export default async function SettingsPage({
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

  // Format the creation date
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'N/A';

  return (
    <div className={styles.container}>
      <PortalHeader 
        title={dict.portal.nav.settings}
        subtitle="Configure your engineering cockpit and manage your account security protocols."
        statusTag="SYSTEM CONFIGURATION"
      />

      <main className={styles.grid}>
        {/* Account Info Card */}
        <Card variant="cockpit">
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2>{lang === 'es' ? 'Seguridad de Cuenta' : 'Account Security'}</h2>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>{lang === 'es' ? 'Nombre de Registro' : 'Registry Name'}</label>
              <p>{user.user_metadata?.full_name || 'Generic System User'}</p>
            </div>
            <div className={styles.infoItem}>
              <label>{lang === 'es' ? 'ID del Cockpit (Email)' : 'Cockpit ID (Email)'}</label>
              <p>{user.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>{lang === 'es' ? 'Inicializado En' : 'Initialized On'}</label>
              <p>{createdAt}</p>
            </div>
          </div>
        </Card>

        {/* System Preferences Card */}
        <Card variant="cockpit">
          <div className={styles.cardHeader}>
            <div className={styles.iconWrapper}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h2>{lang === 'es' ? 'Preferencias del Sistema' : 'System Preferences'}</h2>
          </div>
          
          <div className={styles.controlsWrapper}>
            <SettingsControls lang={lang} dict={dict} />
          </div>
        </Card>
      </main>
      
      <footer className={styles.footer}>
        <p>ENCRYPTION ACTIVE | SESSION {user.id.substring(0, 8).toUpperCase()}</p>
      </footer>
    </div>
  );
}
