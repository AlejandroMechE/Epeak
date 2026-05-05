"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/app/[lang]/portal/PortalHub.module.css';
import Card from '@/components/ui/Card/Card';

interface ProjectOnboardingTerminalProps {
  dict: any;
  lang: string;
}

const ProjectOnboardingTerminal: React.FC<ProjectOnboardingTerminalProps> = ({ dict, lang }) => {
  const [phase, setPhase] = useState(1);

  const phases = [
    { id: 1, label: dict.portal.hub.step_orientation_label, sub: '01 Orientation' },
    { id: 2, label: dict.portal.hub.step_process_label, sub: '02 Process' },
    { id: 3, label: dict.portal.hub.step_flow_label, sub: '03 Lifecycle' },
    { id: 4, label: dict.portal.hub.step_action_label, sub: '04 Start' },
  ];

  const nextPhase = () => setPhase(prev => Math.min(prev + 1, 4));
  const prevPhase = () => setPhase(prev => Math.max(prev - 1, 1));

  return (
    <Card 
      variant="cockpit" 
      hoverable={false}
      className={styles.terminalContainer}
    >
      {/* SIDEBAR CHECKLIST */}
      <aside className={styles.sidebarChecklist}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTag}>{lang === 'es' ? 'HUB DE INGENIERÍA' : 'ENGINEERING HUB'}</span>
          <h3>{lang === 'es' ? 'GUÍA DE INICIO' : 'ONBOARDING GUIDE'}</h3>
        </div>
        
        <nav className={styles.checkNav}>
          {phases.map((p) => (
            <button 
              key={p.id}
              onClick={() => setPhase(p.id)}
              className={`${styles.checkItem} ${phase === p.id ? styles.active : ''} ${phase > p.id ? styles.completed : ''}`}
            >
              <div className={styles.stepIndicator}>
                {phase > p.id ? '✓' : `0${p.id}`}
              </div>
              <div className={styles.stepLabel}>
                <span className={styles.stepSubText}>{p.sub}</span>
                <span className={styles.stepMainText}>{p.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <p className={styles.footerNote}>{lang === 'es' ? 'SISTEMA LISTO' : 'SYSTEM READY'}</p>
          <div className={styles.radarPing} />
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className={styles.terminalContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.phaseWrapper}
          >
            {/* PHASE 01: ORIENTATION */}
            {phase === 1 && (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeader}>
                  <span className={styles.phaseTag}>{lang === 'es' ? 'BIENVENIDO' : 'WELCOME'}</span>
                  <h2 className={styles.highContrastHeader}>{dict.portal.hub.empty_title}</h2>
                </header>
                
                <div className={styles.orientationOverview}>
                  <p className={styles.deploymentDesc}>{dict.portal.hub.orientation_desc}</p>
                  
                  <div className={styles.quickActionRow}>
                    <Link href={`/${lang}/portal/initialize`} className={styles.quickStartBtn}>
                      {dict.portal.hub.empty_cta} →
                    </Link>
                    <span className={styles.actionHint}>{dict.portal.hub.empty_cta_subtitle}</span>
                  </div>
                </div>

                <div className={styles.phaseActions}>
                  <button onClick={nextPhase} className={styles.nextBtn}>
                    {lang === 'es' ? 'CONOCER METODOLOGÍA →' : 'EXPLORE METHODOLOGY →'}
                  </button>
                </div>
              </div>
            )}

            {/* PHASE 02: METHODOLOGY */}
            {phase === 2 && (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeader}>
                  <span className={styles.phaseTag}>{dict.portal.hub.how_it_works}</span>
                  <h2 className={styles.highContrastHeader}>{lang === 'es' ? 'Proceso de Ingeniería' : 'Engineering Process'}</h2>
                </header>
                
                <div className={styles.methodologyCompactGrid}>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className={styles.compactStep}>
                      <span className={styles.stepNum}>0{num}</span>
                      <h4>{dict.portal.hub.methodology[`step${num}_title`]}</h4>
                      <p>{dict.portal.hub.methodology[`step${num}_desc`]}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.phaseActions}>
                  <button onClick={prevPhase} className={styles.backBtn}>{lang === 'es' ? '← VOLVER' : '← BACK'}</button>
                  <button onClick={nextPhase} className={styles.nextBtn}>
                    {lang === 'es' ? 'FLUJO DEL PROYECTO →' : 'PROJECT FLOW →'}
                  </button>
                </div>
              </div>
            )}

            {/* PHASE 03: PROJECT FLOW */}
            {phase === 3 && (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeader}>
                  <span className={styles.phaseTag}>{lang === 'es' ? 'OPERACIONES' : 'OPERATIONS'}</span>
                  <h2 className={styles.highContrastHeader}>{dict.portal.hub.flow_title}</h2>
                </header>

                <div className={styles.reportsStack}>
                  <div className={styles.reportItem}>
                    <div className={styles.stepIndicatorSmall}>01</div>
                    <p><strong>{dict.portal.hub.flow.step1}</strong>: {lang === 'es' ? 'Definimos el roadmap y los requerimientos iniciales.' : 'We define the roadmap and initial requirements.'}</p>
                  </div>
                  <div className={styles.reportItem}>
                    <div className={styles.stepIndicatorSmall}>02</div>
                    <p><strong>{dict.portal.hub.flow.step2}</strong>: {lang === 'es' ? 'Evaluamos la viabilidad técnica antes de escribir una sola línea de código.' : 'We evaluate technical feasibility before writing a single line of code.'}</p>
                  </div>
                  <div className={styles.reportItem}>
                    <div className={styles.stepIndicatorSmall}>03</div>
                    <p><strong>{dict.portal.hub.flow.step3}</strong>: {lang === 'es' ? 'Ejecución iterativa con visibilidad total desde este dashboard.' : 'Iterative execution with full visibility from this dashboard.'}</p>
                  </div>
                </div>

                <div className={styles.phaseActions}>
                  <button onClick={prevPhase} className={styles.backBtn}>{lang === 'es' ? '← VOLVER' : '← BACK'}</button>
                  <button onClick={nextPhase} className={styles.nextBtn}>
                    {lang === 'es' ? 'INICIAR PROYECTO →' : 'START PROJECT →'}
                  </button>
                </div>
              </div>
            )}

            {/* PHASE 04: ACTION */}
            {phase === 4 && (
              <div className={styles.phaseContent}>
                <header className={styles.phaseHeader}>
                  <span className={styles.phaseTag}>{lang === 'es' ? 'LISTO PARA DESPLIEGUE' : 'READY FOR DEPLOYMENT'}</span>
                  <h2 className={styles.highContrastHeader}>{lang === 'es' ? '¿Comenzamos el diseño?' : 'Shall we begin the design?'}</h2>
                </header>

                <div className={styles.deploymentBrief}>
                  <p className={styles.deploymentDesc}>{lang === 'es' ? 'Tu centro de ingeniería está configurado y listo. Puedes iniciar la configuración de tu sistema ahora mismo.' : 'Your engineering hub is configured and ready. You can start your system setup right now.'}</p>
                  
                  <div className={styles.ctaTerminalBox}>
                    <Link href={`/${lang}/portal/initialize`} className={styles.primaryCTA}>
                      {dict.portal.hub.empty_cta} →
                    </Link>
                    <Link href={`/${lang}/#showcase`} className={styles.secondaryCTA}>
                      {dict.portal.hub.view_showcase}
                    </Link>
                    <p className={styles.ctaReassuranceCompact}>
                      {dict.portal.hub.final_cta_subtitle}
                    </p>
                  </div>
                </div>

                <div className={styles.trustFooterCompact}>
                  <p>{dict.portal.hub.trust_anchor}</p>
                </div>

                <div className={styles.phaseActions}>
                  <button onClick={prevPhase} className={styles.backBtn}>{lang === 'es' ? '← VOLVER' : '← BACK'}</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </Card>
  );
};

export default ProjectOnboardingTerminal;
