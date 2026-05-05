import { 
  Rocket, 
  Activity, 
  Coins, 
  Clock, 
  ShieldCheck, 
  Zap, 
  LayoutDashboard, 
  ArrowRight,
  Cpu,
  Settings
} from "lucide-react";
import Link from "next/link";
import styles from "./HomeDashboard.module.css";
import Card from "../ui/Card/Card";

interface HomeDashboardProps {
  project: any;
  lang: string;
  dict: any;
}

export default function HomeDashboard({ project, lang, dict }: HomeDashboardProps) {
  const projectId = project.id.split('-')[0].toUpperCase();
  
  return (
    <section className={styles.dashboardSection}>
      <div className="container-main">
        <div className={styles.technicalHeader}>
          <span className={styles.projectIdBadge}>PROJECT SERIAL: {projectId}</span>
          <h1 className={styles.mainTitle}>
            {lang === 'es' ? 'Cabina de ' : 'Project '}
            <span className="text-gradient-filament">{project.title}</span>
          </h1>
          <p className={styles.introText}>
            {lang === 'es' 
              ? "Bienvenido de nuevo. Tu infraestructura está en fase de despliegue."
              : "Welcome back. Your infrastructure is currently in deployment phase."}
          </p>
        </div>

        <div className={styles.projectConsole}>
          <div className={styles.projectInfo}>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <span><Activity size={12} /> {dict.portal.hub.status_label}</span>
                <div className={styles.statusValue}>
                  <div className={styles.livePulse} />
                  {project.status}
                </div>
              </div>
              <div className={styles.statusItem}>
                <span><Coins size={12} /> {lang === 'es' ? 'VALOR INVERSIÓN' : 'INVESTMENT VALUE'}</span>
                <div className={styles.statusValue}>
                  {project.total_price.toLocaleString()} {project.currency}
                </div>
              </div>
              <div className={styles.statusItem}>
                <span><Clock size={12} /> {lang === 'es' ? 'ENTREGA ESTIMADA' : 'ESTIMATED DELIVERY'}</span>
                <div className={styles.statusValue}>{project.payload?.logistics?.endDate || "TBD"}</div>
              </div>
              <div className={styles.statusItem}>
                <span><ShieldCheck size={12} /> {lang === 'es' ? 'NIVEL SEGURIDAD' : 'SECURITY LEVEL'}</span>
                <div className={styles.statusValue} style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>IRONCLAD ACTIVE</div>
              </div>
            </div>

            <div className={styles.quickJumpRow}>
              <Link href={`/${lang}/portal`} className={styles.jumpLink}>
                <LayoutDashboard size={14} /> {lang === 'es' ? 'Ir al Portal' : 'Enter Portal'}
              </Link>
              <Link href={`/${lang}/portal/project`} className={styles.jumpLink}>
                <Rocket size={14} /> {lang === 'es' ? 'Ver Detalles' : 'View Details'}
              </Link>
            </div>
          </div>

          <div className={styles.pendingSection}>
            <h4>{lang === 'es' ? 'SIGUIENTES PASOS' : 'NEXT PROTOCOLS'}</h4>
            <ul className={styles.taskList}>
              <li className={styles.taskItem}>
                <Zap size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>{lang === 'es' ? "Revisión técnica inicial" : "Initial technical review"}</span>
              </li>
              <li className={styles.taskItem}>
                <Zap size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>{lang === 'es' ? "Confirmación de arquitectura" : "Architecture confirmation"}</span>
              </li>
            </ul>
            <div className={styles.systemStatus}>
              {lang === 'es' ? "// SISTEMA OPERATIVO" : "// SYSTEM OPERATIONAL"}
            </div>
          </div>
        </div>

        <div className={styles.actionGrid}>
          <Link href={`/${lang}/portal/initialize`} className={styles.cardLink}>
            <Card variant="cockpit" className={styles.actionCard}>
              <div className={styles.cardIcon}><Rocket size={20} /></div>
              <h3>{lang === 'es' ? 'NUEVO PROYECTO' : 'NEW PROJECT'}</h3>
              <p>{lang === 'es' ? 'Arquitectar otra solución.' : 'Architect another solution.'}</p>
              <ArrowRight size={14} className={styles.arrow} />
            </Card>
          </Link>
          <Link href={`/${lang}/portal/showcase`} className={styles.cardLink}>
            <Card variant="cockpit" className={styles.actionCard}>
              <div className={styles.cardIcon}><Cpu size={20} /></div>
              <h3>{lang === 'es' ? 'SHOWCASE' : 'TECH SHOWCASE'}</h3>
              <p>{lang === 'es' ? 'Explorar módulos técnicos.' : 'Explore technical modules.'}</p>
              <ArrowRight size={14} className={styles.arrow} />
            </Card>
          </Link>
          <Link href={`/${lang}/portal/settings`} className={styles.cardLink}>
            <Card variant="cockpit" className={styles.actionCard}>
              <div className={styles.cardIcon}><Settings size={20} /></div>
              <h3>{lang === 'es' ? 'CONFIG' : 'CONFIG'}</h3>
              <p>{lang === 'es' ? 'Gestionar identidad.' : 'Manage identity.'}</p>
              <ArrowRight size={14} className={styles.arrow} />
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}
