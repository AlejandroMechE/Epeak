import React from 'react';
import { Activity, MessageSquare, ShieldCheck, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import Link from 'next/link';
import styles from "./ProjectOverview.module.css";
import Card from "../ui/Card/Card";

interface ProjectOverviewProps {
  project: {
    id: string;
    title: string;
    status: string;
  };
  lang: string;
  href: string;
  prevHref?: string | null;
  nextHref?: string | null;
  projectIndex?: number;  // 1-based
  projectCount?: number;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, lang, href, prevHref, nextHref, 
  projectIndex = 1, projectCount = 1 
}) => {
  const serialId = project.id.split('-')[0].toUpperCase();
  
  return (
    <div className={styles.cockpitWrapper}>
      {/* Visible project switcher bar — only shown when user has multiple projects */}
      {projectCount > 1 && (
        <div className={styles.projectNav}>
          {prevHref ? (
            <Link href={prevHref} className={styles.navArrow}>
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <span className={`${styles.navArrow} ${styles.navArrowDisabled}`}><ChevronLeft size={16} /></span>
          )}
          <span className={styles.projectCounter}>
            {lang === 'es' ? 'PROYECTO' : 'PROJECT'} {projectIndex} / {projectCount}
          </span>
          {nextHref ? (
            <Link href={nextHref} className={styles.navArrow}>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className={`${styles.navArrow} ${styles.navArrowDisabled}`}><ChevronRight size={16} /></span>
          )}
        </div>
      )}

      <Card variant="cockpit" className={styles.overviewCard}>
        <div className={styles.sectionTitle}>
          {lang === 'es' ? 'RESUMEN TÉCNICO DE INGENIERÍA' : 'ENGINEERING PROJECT OVERVIEW'}
        </div>
      
      <div className={styles.cockpitLayout}>
        {/* Left Col: Core Identity */}
        <div className={styles.monolithBlock}>
          <div className={styles.metaNodes}>
            <span className={styles.node}><Zap size={10} /> SERIAL: {serialId}</span>
            <span className={styles.node}><ShieldCheck size={10} /> SECURITY: IRONCLAD</span>
          </div>
          <h2 className="text-gradient-filament">{project.title}</h2>
          <div className={styles.statusBadge}>
            <Activity size={14} className={styles.pulseIcon} />
            <span>{project.status}</span>
          </div>
        </div>

        {/* Right Col: Progress & Actions */}
        <div className={styles.sidebarActions}>
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>{lang === 'es' ? 'PROGRESO DE FASE' : 'PHASE PROGRESS'}</span>
              <span className={styles.percentage}>25%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '25%' }} />
              <div className={styles.progressSegments}>
                {[...Array(10)].map((_, i) => <div key={i} className={styles.segment} />)}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href={href} className={styles.actionLink}>
              {lang === 'es' ? 'Ver Detalles' : 'View Details'}
            </Link>
            <Link href={`/${lang}/portal/chat`} className={styles.chatLink}>
              <MessageSquare size={13} />
              {lang === 'es' ? 'Soporte Chat' : 'Support Chat'}
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.cornerAccentTL} />
      <div className={styles.cornerAccentBR} />
    </Card>
    </div>
  );
};

export default ProjectOverview;
