import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./PortalHub.module.css";
import PortalHeader from "@/components/Portal/PortalHeader";
import { 
  Settings, 
  FileText,
  LifeBuoy,
  MessageSquare,
  ArrowRight,
  Clock,
  Zap
} from "lucide-react";
import ProjectOnboardingTerminal from "@/components/Portal/ProjectOnboardingTerminal";
import ProjectOverview from "@/components/Portal/ProjectOverview";

const mockNotifications = [
  {
    id: 1,
    source: 'General',
    isProject: false,
    type: 'Update',
    title: 'Architecture Review Complete',
    preview: 'The core infrastructure has been validated...',
    time: '2h ago',
    unread: true
  },
  {
    id: 2,
    source: 'Project: Nexus Core',
    isProject: true,
    type: 'Question',
    title: 'Clarification Needed: Phase 2',
    preview: 'We need to confirm the API gateway requirements...',
    time: '5h ago',
    unread: false
  }
];

// --- PROJECTS LOGIC ---
// In a real scenario, we'll fetch all projects
// const { data: projects } = await supabase.from('projects').select('*')...

export default async function PortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const { p: activeId } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${lang}/login`);
    return; // TypeScript type narrowing
  }

  // --- LOGIC: STATE DETECTION (DYNAMIC) ---
  const userId = user.id;
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, status, created_at")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  const activeProject = projects?.find(p => p.id === activeId) || projects?.[0];
  const hasActiveProject = !!activeProject;

  return (
    <div className={styles.hubContainer}>
      <PortalHeader 
        title={dict.portal.hub.welcome_title}
        subtitle={hasActiveProject 
          ? (lang === 'es' ? "Resumen de tu infraestructura activa." : "Active infrastructure overview.")
          : dict.portal.hub.welcome_subtitle
        }
        statusTag={hasActiveProject ? activeProject.status : dict.portal.nav.dashboard}
      />

      {hasActiveProject ? (
        /* --- STATE 2: EXECUTION MODE (Active Projects) --- */
        <div className={styles.executionMode}>
          <div className={styles.overviewWrapper}>
            {(() => {
              const currentId = activeProject?.id;
              const currentIndex = projects?.findIndex(p => p.id === currentId) ?? 0;
              const prevProject = currentIndex > 0 ? projects?.[currentIndex - 1] : null;
              const nextProject = (projects && currentIndex < projects.length - 1) ? projects[currentIndex + 1] : null;
              
              const prevHref = prevProject ? `/${lang}/portal?p=${prevProject.id}` : null;
              const nextHref = nextProject ? `/${lang}/portal?p=${nextProject.id}` : null;

              return (
                <ProjectOverview 
                  project={activeProject} 
                  lang={lang} 
                  href={`/${lang}/portal/project`} 
                  prevHref={prevHref}
                  nextHref={nextHref}
                  projectIndex={currentIndex + 1}
                  projectCount={projects?.length ?? 1}
                />
              );
            })()}
          </div>

          <div className={styles.secondaryGrid}>
            {/* COMMUNICATION CENTER */}
            <div className={styles.communicationCenter}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.guideTitle}>
                  {lang === 'es' ? 'Centro de Comunicación' : 'Communication Center'}
                </h3>
                <Link href={`/${lang}/portal/chat`} className={styles.viewAll}>
                  {lang === 'es' ? 'Ver todo' : 'View all'} <ArrowRight size={14} />
                </Link>
              </div>

              <div className={styles.notificationList}>
                {mockNotifications.map(notif => (
                  <Link key={notif.id} href={`/${lang}/portal/chat`} className={styles.notifItem}>
                    <div className={`${styles.statusDot} ${notif.unread ? styles.activeDot : ''}`} />
                    <div className={styles.notifContent}>
                      <div className={styles.notifHeader}>
                        <div className={styles.notifSource}>
                          <span className={`${styles.sourceBadge} ${notif.isProject ? styles.projectBadge : ''}`}>
                            {notif.source}
                          </span>
                          <span className={styles.notifType}>{notif.type}</span>
                        </div>
                        <span className={styles.notifTime}><Clock size={10} /> {notif.time}</span>
                      </div>
                      <h4 className={styles.notifTitle}>{notif.title}</h4>
                      <p className={styles.notifPreview}>{notif.preview}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SYSTEM NAVIGATION GUIDE */}
            <div className={styles.navigationGuide}>
              <h3 className={styles.guideTitle}>
                {lang === 'es' ? 'Módulos del Sistema' : 'System Modules'}
              </h3>
              <div className={styles.guideGrid}>
                <Link href={`/${lang}/portal/project`} className={styles.guideCard}>
                  <div className={styles.guideIcon}><FileText size={18} /></div>
                  <div className={styles.guideText}>
                    <h4>{lang === 'es' ? 'Estado Proyectos' : 'Project Status'}</h4>
                    <p>{lang === 'es' ? 'Seguimiento de entregables y salud del sistema.' : 'Track deliverables and system health.'}</p>
                  </div>
                </Link>
                
                <Link href={`/${lang}/portal/showcase`} className={styles.guideCard}>
                  <div className={styles.guideIcon}><Zap size={18} /></div>
                  <div className={styles.guideText}>
                    <h4>{lang === 'es' ? 'Showcase Técnico' : 'Tech Showcase'}</h4>
                    <p>{lang === 'es' ? 'Explora ejemplos de implementación real.' : 'Explore real implementation examples.'}</p>
                  </div>
                </Link>

                <Link href={`/${lang}/portal/chat`} className={styles.guideCard}>
                  <div className={styles.guideIcon}><MessageSquare size={18} /></div>
                  <div className={styles.guideText}>
                    <h4>{lang === 'es' ? 'Chat Soporte' : 'Support Chat'}</h4>
                    <p>{lang === 'es' ? 'Comunicación directa con ingeniería.' : 'Direct engineering communication.'}</p>
                  </div>
                </Link>

                <Link href={`/${lang}/portal/settings`} className={styles.guideCard}>
                  <div className={styles.guideIcon}><Settings size={18} /></div>
                  <div className={styles.guideText}>
                    <h4>{lang === 'es' ? 'Ajustes' : 'Settings'}</h4>
                    <p>{lang === 'es' ? 'Configuración del sistema.' : 'System configuration.'}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- STATE 1: EXPLORATION MODE (No Project) --- */
        <div className={styles.explorationMode}>
          <div style={{ marginTop: '3rem' }}>
            <ProjectOnboardingTerminal dict={dict} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}
