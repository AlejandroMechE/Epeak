import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import styles from './ProjectSelector.module.css';

interface ProjectSelectorProps {
  projects: any[];
  activeId: string;
  lang: string;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects, activeId, lang }) => {
  if (projects.length <= 1) return null;

  const currentIndex = projects.findIndex(p => p.id === activeId);
  const prevProject = projects[currentIndex - 1];
  const nextProject = projects[currentIndex + 1];

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.label}>
        <LayoutGrid size={12} />
        {lang === 'es' ? 'SELECTOR DE INFRAESTRUCTURA' : 'INFRASTRUCTURE SELECTOR'}
      </div>
      
      <div className={styles.controls}>
        {prevProject ? (
          <Link href={`/${lang}/portal?p=${prevProject.id}`} className={styles.navBtn} title="Previous Project">
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <div className={`${styles.navBtn} ${styles.disabled}`}><ChevronLeft size={16} /></div>
        )}

        <div className={styles.projectStrip}>
          {projects.map((proj) => {
            const isActive = proj.id === activeId;
            const serial = proj.id.split('-')[0].toUpperCase();
            return (
              <Link 
                key={proj.id} 
                href={`/${lang}/portal?p=${proj.id}`} 
                className={`${styles.projNode} ${isActive ? styles.activeNode : ''}`}
              >
                {serial}
              </Link>
            );
          })}
        </div>

        {nextProject ? (
          <Link href={`/${lang}/portal?p=${nextProject.id}`} className={styles.navBtn} title="Next Project">
            <ChevronRight size={16} />
          </Link>
        ) : (
          <div className={`${styles.navBtn} ${styles.disabled}`}><ChevronRight size={16} /></div>
        )}
      </div>
    </div>
  );
};

export default ProjectSelector;
