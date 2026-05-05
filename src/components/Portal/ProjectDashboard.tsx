import React from "react";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, Activity, Calendar, DollarSign, Info
} from "lucide-react";
import styles from "./ProjectDashboard.module.css";
import MilestoneStepper from "./MilestoneStepper";
import DocumentUpload from "./DocumentUpload";
import ProjectChat from "./ProjectChat";
import { Project, ProjectDocument } from "@/types/portal";

// Keys to skip from payload rendering
const SKIP_KEYS = new Set([
  '_internal', '_admin', 'raw', 'stripe_id', 'snapshot_version',
  'recommendation_flag', 'features', // empty arrays
]);

/**
 * Deep-flatten a payload object into a list of { section, key, value } tuples.
 * Handles nested objects (recursive) and arrays of objects (renders each item).
 */
function flattenPayload(payload: Record<string, any>): Array<{
  section: string;
  entries: Array<{ key: string; value: string }>;
}> {
  const sections: Array<{ section: string; entries: Array<{ key: string; value: string }> }> = [];

  const formatKey = (k: string) =>
    k.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/\b\w/g, c => c.toUpperCase()).trim();

  const formatValue = (v: any): string => {
    if (v === null || v === undefined || v === '') return '';
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    if (Array.isArray(v)) {
      if (v.length === 0) return '';
      // Array of primitives (e.g., stack: ["OpenAI GPT-4", "LangChain"])
      if (typeof v[0] !== 'object') return v.join(', ');
      return ''; // Arrays of objects handled separately
    }
    if (typeof v === 'number') return v.toLocaleString();
    return String(v);
  };

  for (const [sectionKey, sectionVal] of Object.entries(payload)) {
    if (SKIP_KEYS.has(sectionKey)) continue;
    if (sectionVal === null || sectionVal === undefined) continue;

    const sectionTitle = formatKey(sectionKey);
    const entries: Array<{ key: string; value: string }> = [];

    if (typeof sectionVal === 'object' && !Array.isArray(sectionVal)) {
      // Nested object — expand its keys
      for (const [k, v] of Object.entries(sectionVal)) {
        if (SKIP_KEYS.has(k)) continue;
        const formatted = formatValue(v);
        if (formatted) {
          entries.push({ key: formatKey(k), value: formatted });
        }
      }
    } else if (Array.isArray(sectionVal)) {
      // Array of objects (e.g., addons)
      sectionVal.forEach((item: any, i: number) => {
        if (typeof item === 'object') {
          for (const [k, v] of Object.entries(item)) {
            if (SKIP_KEYS.has(k)) continue;
            const formatted = formatValue(v);
            if (formatted) {
              entries.push({ key: `[${i + 1}] ${formatKey(k)}`, value: formatted });
            }
          }
        }
      });
    } else {
      // Top-level primitive
      const formatted = formatValue(sectionVal);
      if (formatted) entries.push({ key: sectionTitle, value: formatted });
    }

    if (entries.length > 0) {
      sections.push({ section: sectionTitle, entries });
    }
  }

  return sections;
}

interface ProjectDashboardProps {
  project: Project | null;
  projects: Project[];
  projectIndex: number;
  projectCount: number;
  prevHref: string | null;
  nextHref: string | null;
  documents: ProjectDocument[];
  documentUrls: Record<string, string>;
  userId: string;
  dict: any;
  lang: string;
}

export default function ProjectDashboard({
  project,
  projects,
  projectIndex,
  projectCount,
  prevHref,
  nextHref,
  documents,
  documentUrls,
  userId,
  dict,
  lang,
}: ProjectDashboardProps) {
  const isDemo = !project;
  const payloadSections = project?.payload ? flattenPayload(project.payload) : [];

  return (
    <div className={styles.dashboardContainer}>

      {/* ── PROJECT SWITCHER ── */}
      {projectCount > 1 && !isDemo && (
        <div className={styles.projectNav}>
          {prevHref ? (
            <Link href={prevHref} className={styles.navArrow}><ChevronLeft size={16} /></Link>
          ) : (
            <span className={`${styles.navArrow} ${styles.navDisabled}`}><ChevronLeft size={16} /></span>
          )}
          <span className={styles.projectCounter}>
            {lang === 'es' ? 'PROYECTO' : 'PROJECT'} {projectIndex} / {projectCount}
          </span>
          {nextHref ? (
            <Link href={nextHref} className={styles.navArrow}><ChevronRight size={16} /></Link>
          ) : (
            <span className={`${styles.navArrow} ${styles.navDisabled}`}><ChevronRight size={16} /></span>
          )}
        </div>
      )}

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.statusRow}>
          <Activity size={13} className={styles.pulseIcon} />
          <span className={styles.statusTag}>
            {isDemo ? 'NO PROJECT' : project.status.toUpperCase()}
          </span>
        </div>
        <h1 className="text-gradient-filament">
          {isDemo ? 'Project Status' : project.title}
        </h1>
        {project?.description && (
          <p className={styles.description}>{project.description}</p>
        )}
        {!isDemo && (
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              <DollarSign size={11} />
              {project.currency} {project.total_price.toLocaleString()}
            </span>
            <span className={styles.metaItem}>
              <Calendar size={11} />
              {new Date(project.created_at).toLocaleDateString(
                lang === 'es' ? 'es-MX' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )}
            </span>
          </div>
        )}
      </header>

      {!isDemo ? (
        <>
          {/* ── MISSION TIMELINE ── */}
          <section className={styles.section}>
            <div className={styles.sectionLabel}>
              {lang === 'es' ? 'LÍNEA DE TIEMPO' : 'MISSION TIMELINE'}
            </div>
            <MilestoneStepper
              currentStatus={project.status}
              milestones={project.milestones || []}
              dict={dict.portal.stepper}
            />
          </section>

          {/* ── MAIN GRID: Details + Chat ── */}
          <div className={styles.mainGrid}>

            {/* LEFT COL: Technical Details + Docs */}
            <div className={styles.leftCol}>

              {/* Technical Details */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <Info size={13} />
                  {lang === 'es' ? 'DETALLES TÉCNICOS' : 'TECHNICAL DETAILS'}
                </div>

                {payloadSections.length > 0 ? (
                  <div className={styles.sectionsGrid}>
                    {payloadSections.map(({ section, entries }) => (
                      <div key={section} className={styles.payloadSection}>
                        <div className={styles.sectionTag}>{section}</div>
                        {entries.map(({ key, value }) => (
                          <div key={key} className={styles.payloadRow}>
                            <span className={styles.payloadKey}>{key}</span>
                            <span className={styles.payloadValue}>{value}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyNote}>
                    {lang === 'es'
                      ? 'Los detalles técnicos serán populados por el equipo.'
                      : 'Technical details will be populated by the engineering team.'}
                  </p>
                )}
              </div>

              {/* Document Upload */}
              <div className={styles.panel}>
                <DocumentUpload
                  projectId={project.id}
                  lang={lang}
                  initialDocuments={documents}
                  initialUrls={documentUrls}
                />
              </div>
            </div>

            {/* RIGHT COL: Inline Project Chat */}
            <div className={styles.rightCol}>
              <ProjectChat
                projectId={project.id}
                userId={userId}
                lang={lang}
                projectTitle={project.title}
              />
            </div>
          </div>

          {/* ── MILESTONES DELIVERABLES ── */}
          {project.milestones && project.milestones.length > 0 && (
            <section className={styles.section}>
              <div className={styles.sectionLabel}>
                {lang === 'es' ? 'ENTREGABLES' : 'DELIVERABLES'}
              </div>
              <div className={styles.milestonesTable}>
                {project.milestones
                  .sort((a, b) => a.order - b.order)
                  .map(ms => (
                    <div key={ms.id} className={`${styles.milestoneRow} ${styles[`ms_${ms.status}`]}`}>
                      <div className={styles.msStatus}>
                        <span className={`${styles.msDot} ${styles[`dot_${ms.status}`]}`} />
                        <span className={styles.msStatusLabel}>{ms.status}</span>
                      </div>
                      <div className={styles.msContent}>
                        <span className={styles.msTitle}>{ms.title}</span>
                        {ms.description && (
                          <span className={styles.msDesc}>{ms.description}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className={styles.emptyDashboard}>
          <p className={styles.emptyNote}>
            {lang === 'es'
              ? 'No tienes proyectos activos. Inicia uno a través del motor de ventas.'
              : 'You have no active projects. Start one through the Sales Engine.'}
          </p>
          <Link href={`/${lang}/portal/initialize`} className={styles.initLink}>
            {lang === 'es' ? 'Iniciar Proyecto' : 'Start a Project'}
          </Link>
        </div>
      )}
    </div>
  );
}
