"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createProjectDirectly } from "@/features/sales/actions";
import { 
  Zap, 
  Cpu, 
  Atom, 
  Check, 
  Shield, 
  ShieldCheck,
  Workflow, 
  Bug, 
  Gauge, 
  MessageSquare, 
  Layout, 
  Rocket, 
  RefreshCw,
  Target,
  Brain,
  Hammer,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Users,
  Fingerprint,
  Globe,
  FileText,
  Link as LinkIcon,
  AlertCircle,
  MapPin,
  Calendar,
  Lock,
  Mail,
  Hash,
  Terminal,
  Activity,
  CreditCard,
  Database,
  Code,
  Layers,
  Wind,
  Settings,
  ShieldAlert,
  Search,
  Box,
  Infinity as InfinityIcon,
  ArrowRight
} from "lucide-react";
import Card from "@/components/ui/Card/Card";
import styles from "./PackageWizard.module.css";

interface PackageWizardProps {
  lang: string;
  dict: any;
  showSidebar?: boolean;
}

const getPlans = (d: any) => [
  { 
    id: "mvp", 
    title: d.plans.mvp_title, 
    desc: d.plans.mvp_desc, 
    features: d.plans.mvp_features || [],
    price: d.plans.mvp_price, 
    icon: <Rocket size={18} /> 
  },
  { 
    id: "engine", 
    title: d.plans.engine_title, 
    desc: d.plans.engine_desc, 
    features: d.plans.engine_features || [],
    price: d.plans.engine_price, 
    icon: <Cpu size={18} /> 
  },
  { 
    id: "reactor", 
    title: d.plans.reactor_title, 
    desc: d.plans.reactor_desc, 
    features: d.plans.reactor_features || [],
    price: d.plans.reactor_price, 
    icon: <Atom size={18} /> 
  },
];

const getTacticalServices = (d: any, category: string | null) => {
  if (category === "ai") {
    return [
      { id: "ai_agent", title: d.tactical.ai_agent_title, desc: d.tactical.ai_agent_desc, price: d.tactical.ai_agent_price, icon: <Cpu size={18} /> },
      { id: "workflow_auto", title: d.tactical.workflow_auto_title, desc: d.tactical.workflow_auto_desc, price: d.tactical.workflow_auto_price, icon: <Workflow size={18} /> }
    ];
  }
  if (category === "growth") {
    return [
      { id: "landing", title: d.tactical.spark_landing_title, desc: d.tactical.spark_landing_desc, price: d.tactical.spark_landing_price, icon: <Layout size={18} /> },
      { id: "funnel", title: d.tactical.sales_funnel_title, desc: d.tactical.sales_funnel_desc, price: d.tactical.sales_funnel_price, icon: <TrendingUp size={18} /> }
    ];
  }
  if (category === "flash") {
    return [
      { id: "fix", title: d.tactical.quick_fix_title, desc: d.tactical.quick_fix_desc, price: d.tactical.quick_fix_price, icon: <Bug size={18} /> },
      { id: "speed", title: d.tactical.speed_boost_title, desc: d.tactical.speed_boost_desc, price: d.tactical.speed_boost_price, icon: <Gauge size={18} /> }
    ];
  }
  if (category === "audit") {
    return [
      { id: "discovery", title: d.tactical.audit_discovery_title, desc: d.tactical.audit_discovery_desc, price: d.tactical.audit_discovery_price, icon: <MessageSquare size={18} /> },
      { id: "scan", title: d.tactical.audit_scan_title, desc: d.tactical.audit_scan_desc, price: d.tactical.audit_scan_price, icon: <FileText size={18} /> },
      { id: "roadmap", title: d.tactical.technical_roadmap_title, desc: d.tactical.technical_roadmap_desc, price: d.tactical.technical_roadmap_price, icon: <Shield size={18} /> }
    ];
  }
  return [];
};

const getMaintenanceServices = (d: any) => [
  { id: "base", title: d.recurring.base_title, desc: d.recurring.base_desc, price: d.recurring.base_price, icon: <RefreshCw size={18} /> },
  { id: "pro", title: d.recurring.pro_title, desc: d.recurring.pro_desc, price: d.recurring.pro_price, icon: <RefreshCw size={18} /> },
  { id: "priority", title: d.recurring.priority_title, desc: d.recurring.priority_desc, price: d.recurring.priority_price, icon: <RefreshCw size={18} /> },
];

const getAddons = (d: any, category: string | null) => {
  if (!d.dynamic_addons || !category) return [];
  const cat = category as keyof typeof d.dynamic_addons;
  const ids = d.dynamic_addons[cat] || d.dynamic_addons.systems;
  return ids.map((id: string) => ({
    id,
    ...d.addon_items[id]
  }));
};

export default function PackageWizard({ lang, dict, showSidebar = true }: PackageWizardProps) {
  const router = useRouter();
  const d = dict.portal.wizard;
  const currency = lang === "es" ? "MXN" : "USD";

  // State
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<"flash" | "growth" | "systems" | "ai" | "audit" | "support" | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedTactical, setSelectedTactical] = useState("");
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  
  // Intelligence State
  const [intelligence, setIntelligence] = useState({
    objective: "",
    audience: "",
    benchmarks: "",
    assetLinks: ""
  });

  // Blueprint State
  const [blueprint, setBlueprint] = useState({
    type: "",
    stack: [] as string[],
    customTech: "",
    needRecommendation: false
  });

  // Identity State
  const [discovery, setDiscovery] = useState({
    projectName: "",
    clientName: "",
    company: ""
  });

  // Logistics State
  const [logistics, setLogistics] = useState({
    startDate: "",
    endDate: "",
    repoUrl: "",
    commChannel: "zoom",
    isPrivate: false,
    hasAgreed: false
  });

  const [activeSubStep, setActiveSubStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Reset subStep on main step change
  useEffect(() => {
    setActiveSubStep(0);
  }, [step]);

  // Helper: Suggested Deadline
  const getSuggestedDeadline = (cat: string | null) => {
    const today = new Date();
    let daysToAdd = 30;
    if (cat === "systems") daysToAdd = 60;
    if (cat === "ai") daysToAdd = 30;
    if (cat === "growth") daysToAdd = 14;
    if (cat === "flash") daysToAdd = 3;
    if (cat === "audit") daysToAdd = 7;
    if (cat === "support") daysToAdd = 1;

    const suggested = new Date(today);
    suggested.setDate(today.getDate() + daysToAdd);
    return suggested.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (category) {
      const today = new Date().toISOString().split('T')[0];
      setLogistics(prev => ({
        ...prev,
        startDate: today,
        endDate: getSuggestedDeadline(category)
      }));
      setBlueprint(prev => ({
        ...prev,
        type: "",
        stack: [],
        customTech: "",
        needRecommendation: false
      }));
    }
  }, [category]);

  // Calculations
  const totalPrice = useMemo(() => {
    const activeAddons = getAddons(d, category);
    
    if (category === "systems") {
      const plans = getPlans(d);
      const base = plans.find(p => p.id === selectedPlan)?.price || 0;
      const addonsTotal = selectedAddons.reduce((acc: number, id: string) => {
        return acc + (activeAddons.find((a: any) => a.id === id)?.price || 0);
      }, 0);
      return base + addonsTotal;
    } else if (category === "flash" || category === "growth" || category === "ai" || category === "audit") {
      const tactical = getTacticalServices(d, category);
      const baseTotal = tactical.find(t => t.id === selectedTactical)?.price || 0;
      const addonsTotal = selectedAddons.reduce((acc: number, id: string) => {
        return acc + (activeAddons.find((a: any) => a.id === id)?.price || 0);
      }, 0);
      return baseTotal + addonsTotal;
    } else if (category === "support") {
      const recurring = getMaintenanceServices(d);
      const base = recurring.find(r => r.id === selectedMaintenance)?.price || 0;
      const addonsTotal = selectedAddons.reduce((acc: number, id: string) => {
        return acc + (activeAddons.find((a: any) => a.id === id)?.price || 0);
      }, 0);
      return base + addonsTotal;
    }
    return 0;
  }, [category, selectedPlan, selectedAddons, selectedTactical, selectedMaintenance, d]);

  const [hasReadProtocols, setHasReadProtocols] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const protocolsRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasReadProtocols(true);
    }
  };

  const canProceed = useMemo(() => {
    // Stage 1: Category selection
    if (step === 1) return category !== null;

    // Stage 2: Selection
    if (step === 2) {
      if (category === "systems") return selectedPlan !== ""; 
      if (category === "flash" || category === "growth" || category === "ai" || category === "audit") return selectedTactical !== "";
      if (category === "support") return selectedMaintenance !== ""; 
      return false;
    }

    // Stage 3: Addons (Always true since they are optional)
    if (step === 3) return true;

    // Stage 4: Intelligence & Architecture (Validated per sub-step)
    if (step === 4) {
      if (activeSubStep === 0) {
        return discovery.projectName.length >= 5 && 
               discovery.projectName.length <= 200 &&
               discovery.clientName.length <= 200 &&
               discovery.company.length <= 200;
      }
      if (activeSubStep === 1) return intelligence.objective.length >= 10 && intelligence.audience.length >= 5;
      if (activeSubStep === 2) return blueprint.type !== "" && (blueprint.stack.length > 0 || blueprint.needRecommendation || blueprint.customTech !== "");
      return true;
    }

    // Stage 5: Logistics
    if (step === 5) {
      const today = new Date().toISOString().split('T')[0];
      const datesValid = 
        logistics.startDate !== "" && 
        logistics.endDate !== "" && 
        logistics.startDate >= today &&
        new Date(logistics.startDate) <= new Date(logistics.endDate);
      const commValid = logistics.commChannel !== "";
      return datesValid && commValid;
    }

    // Stage 6: Authorization Lockdown (Validated per sub-step)
    if (step === 6) {
      if (activeSubStep === 0) return logistics.hasAgreed && hasReadProtocols;
      if (activeSubStep === 1) return true; // Review step
      if (activeSubStep === 2) return true; // Final Seal
    }

    return true;
  }, [step, activeSubStep, category, selectedPlan, selectedTactical, selectedMaintenance, intelligence, blueprint, discovery, logistics, hasReadProtocols]);

  const getValidationHint = () => {
    if (canProceed) return null;

    if (lang === 'es') {
      if (step === 1) return "Selecciona el tipo de proyecto";
      if (step === 2) return "Selecciona una configuración base";
      if (step === 4) {
        if (activeSubStep === 0) return "Nombra tu proyecto (mín. 5 car)";
        if (activeSubStep === 1) return "Define Objetivo (mín. 10 car) y Audiencia";
        if (activeSubStep === 2) return "Elige tipo de arquitectura y tecnologías";
      }
      if (step === 5) return "Verifica fechas y canal de contacto";
      if (step === 6) {
        if (!hasReadProtocols) return "Desliza hasta el final para leer protocolos";
        if (!logistics.hasAgreed) return "Debes aceptar los términos del proyecto";
      }
      return "Completa los campos obligatorios (*)";
    } else {
      if (step === 1) return "Select project category";
      if (step === 2) return "Select a base configuration";
      if (step === 4) {
        if (activeSubStep === 0) return "Name your project (min 5)";
        if (activeSubStep === 1) return "Define Objective (min 10) and Audience";
        if (activeSubStep === 2) return "Select architecture and technologies";
      }
      if (step === 5) return "Verify dates and comm channel";
      if (step === 6) {
        if (!hasReadProtocols) return "Scroll to read all protocols";
        if (!logistics.hasAgreed) return "You must agree to project terms";
      }
      return "Complete mandatory fields (*)";
    }
  };

  const formatPrice = (amount: number) => {
    return lang === "es" 
      ? `$${amount.toLocaleString()} MXN` 
      : `$${amount.toLocaleString()} USD`;
  };

  const handleAddonToggle = (id: string) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleTechToggle = (tech: string) => {
    setBlueprint(prev => {
      const isSelected = prev.stack.includes(tech);
      return {
        ...prev,
        stack: isSelected ? prev.stack.filter(t => t !== tech) : [...prev.stack, tech],
        needRecommendation: false
      };
    });
  };

  const handleNext = () => {
    if (!canProceed) return;
    
    // Sub-step management for Stages 4 and 6
    if ((step === 4 && activeSubStep < 3) || (step === 6 && activeSubStep < 2)) {
      setActiveSubStep(prev => prev + 1);
      window.scrollTo(0, 0);
      return;
    }

    if (step < 6) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if ((step === 4 && activeSubStep > 0) || (step === 6 && activeSubStep > 0)) {
      setActiveSubStep(prev => prev - 1);
      window.scrollTo(0, 0);
      return;
    }
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const generateProjectSnapshot = () => {
    // 1. Core Offer Snapshot
    let core: any = null;
    if (category === "systems") core = getPlans(dict.portal.wizard).find(p => p.id === selectedPlan);
    if (category === "support") core = getMaintenanceServices(dict.portal.wizard).find(p => p.id === selectedMaintenance);
    if (["flash", "growth", "ai", "audit"].includes(category || "")) core = getTacticalServices(dict.portal.wizard, category).find(p => p.id === selectedTactical);

    // 2. Addons Snapshot
    const addonsData = getAddons(dict.portal.wizard, category).filter((a: any) => selectedAddons.includes(a.id));

    // 3. Totals
    const basePrice = core?.price || 0;
    const addonsTotal = addonsData.reduce((acc: number, a: any) => acc + (a.price || 0), 0);
    const totalPriceAmount = basePrice + addonsTotal;

    return {
      meta: {
        lang,
        currency,
        snapshot_version: "3.0",
        category_id: category || "unknown"
      },
      core_offer: {
        id: core?.id || "unknown",
        title: core?.title || "Unknown Service",
        price: basePrice,
        desc: core?.desc || "",
        features: core?.features || []
      },
      addons: addonsData.map((a: any) => ({
        id: a.id,
        title: a.title,
        price: a.price,
        desc: a.desc || ""
      })),
      financials: {
        base_price: basePrice,
        addons_total: addonsTotal,
        total_price: totalPriceAmount
      },
      intelligence: {
        objective: intelligence.objective,
        audience: intelligence.audience,
        benchmarks: intelligence.benchmarks,
        assetLinks: intelligence.assetLinks
      },
      blueprint: {
        architecture_type: blueprint.type,
        stack: blueprint.stack,
        custom_needs: blueprint.customTech,
        recommendation_flag: blueprint.needRecommendation
      },
      project_identity: {
        title: discovery.projectName || core?.title || "Project Briefing",
        client_name: discovery.clientName,
        organization: discovery.company
      },
      logistics: {
        start_date: logistics.startDate,
        endDate: logistics.endDate,
        repo_url: logistics.repoUrl,
        comm_channel: logistics.commChannel,
        is_private: logistics.isPrivate
      }
    };
  };

  const handleFinish = async () => {
    setStatus("loading");
    try {
      const snapshot = generateProjectSnapshot();
      const result = await createProjectDirectly(snapshot);
      
      if (result.success) {
        setStatus("success");
        setTimeout(() => router.push(`/${lang}/portal`), 2500);
      } else {
        setStatus("error");
        console.error("Initialization failure:", result.error, result.details);
        
        // Granular error feedback
        if (result.details) {
          const errors = Object.entries(result.details)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('\n');
          alert(`${lang === 'es' ? 'Error de validación protocolar:' : 'Protocol validation failure:'}\n\n${errors}`);
        } else {
          alert(result.error || "Mission protocol failure");
        }
      }
    } catch (err: any) {
      console.error("Communication blackout:", err);
      setStatus("error");
      alert(lang === 'es' ? "Error de conexión con el centro de mando" : "Command center link failure");
    }
  };

  if (status === "success") {
    return (
      <div className={styles.statusView}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className={styles.successIcon}>✓</div>
          <h2 className="text-gradient-filament">PROJECT INITIALIZED</h2>
          <p>Your strategic briefcase has been encrypted and delivered.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar: Social Proof */}
      {showSidebar && step > 0 && (
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h3>{d.reviews.title}</h3>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>100%</span>
                <span className={styles.statLabel}>{d.reviews.stat_success}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>V3</span>
                <span className={styles.statLabel}>CORE</span>
              </div>
            </div>
            
            <div className={styles.reviewSnippet}>
              <p>"{d.reviews.report_1}"</p>
            </div>

            <div className={styles.trustBlock}>
              <h4>{d.trust.title}</h4>
              <ul>
                <li>{d.trust.exp}</li>
                <li>{d.trust.perf}</li>
                <li>{d.trust.comms}</li>
              </ul>
            </div>
          </div>
        </aside>
      )}

      <div className={styles.main}>
        {/* Progress Bar */}
        <div className={styles.progress}>
          {[1, 2, 3, 4, 5, 6].map(s => (
            <div 
              key={s} 
              className={`${styles.dot} ${step >= s ? styles.dotActive : ""}`} 
            />
          ))}
        </div>

        <Card variant="cockpit" className={styles.wizardCard}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={styles.stepContainer}
            >
              <div className={styles.stepHeader}>
                <span className="status-tag">PHASE 0{step}</span>
                <h2>{d.steps[`step${step}_title`]}</h2>
                <p>
                  {step === 2 && category === "flash" && d.categories.flash.title}
                  {step === 2 && category === "growth" && d.categories.growth.title}
                  {step === 2 && category === "systems" && d.categories.systems.title}
                  {step === 2 && category === "ai" && d.categories.ai.title}
                  {step === 2 && category === "audit" && d.categories.audit.title}
                  {step === 2 && category === "support" && d.categories.support.title}
                  {step !== 2 && d.steps[`step${step}_subtitle`]}
                </p>
              </div>

              <div className={styles.stepMain}>
                {/* STAGE 1: CATEGORY SELECTION */}
                {step === 1 && (
                  <>
                    <div className={styles.guidedHeader}>
                      <button 
                        className={category === "systems" ? styles.shortcutActive : ""}
                        onClick={() => setCategory("systems")}
                      >
                        <Brain size={14} /> {lang === "es" ? "¿Construyendo un sistema?" : "Building a system?"}
                      </button>
                      <button 
                        className={category === "ai" ? styles.shortcutActive : ""}
                        onClick={() => setCategory("ai")}
                      >
                        <Sparkles size={14} /> {lang === "es" ? "¿Automatizar con IA?" : "Automate with AI?"}
                      </button>
                      <button 
                        className={category === "growth" ? styles.shortcutActive : ""}
                        onClick={() => setCategory("growth")}
                      >
                        <TrendingUp size={14} /> {lang === "es" ? "¿Quieres vender más?" : "Want to sell more?"}
                      </button>
                      <button 
                        className={category === "flash" ? styles.shortcutActive : ""}
                        onClick={() => setCategory("flash")}
                      >
                        <Zap size={14} /> {lang === "es" ? "¿Necesitas algo rápido?" : "Need something fast?"}
                      </button>
                      <button 
                        className={category === "audit" ? styles.shortcutActive : ""}
                        onClick={() => setCategory("audit")}
                      >
                        <HelpCircle size={14} /> {lang === "es" ? "¿No sabes por dónde empezar?" : "Not sure where to start?"}
                      </button>
                      <button 
                        className={category === "support" ? styles.shortcutActive : ""}
                        onClick={() => setCategory("support")}
                      >
                        <RefreshCw size={14} /> {lang === "es" ? "¿Buscas estabilidad?" : "Looking for stability?"}
                      </button>
                    </div>

                    <div className={styles.categoryGrid6}>
                      {Object.keys(d.categories).filter((c: any) => c !== "managed").map((catId: any) => {
                        const cat = d.categories[catId as keyof typeof d.categories];
                        const icons: Record<string, any> = {
                          systems: <Brain size={20} />,
                          ai: <Sparkles size={20} />,
                          growth: <TrendingUp size={20} />,
                          flash: <Zap size={20} />,
                          audit: <HelpCircle size={20} />,
                          support: <RefreshCw size={20} />
                        };

                        return (
                          <div 
                            key={catId}
                            className={`${styles.categoryCardSmall} ${category === catId ? styles.categoryActive : ""}`}
                            onClick={() => setCategory(catId as any)}
                          >
                            <div className={styles.categoryIconSmall}>{icons[catId]}</div>
                            <div className={styles.categoryInfoSmall}>
                              <h3>{cat.title}</h3>
                              <h4>{cat.subtitle}</h4>
                              <p>{cat.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* STAGE 2: SYSTEMS PLANS */}
                {step === 2 && category === "systems" && (
                  <div className={styles.plansStack}>
                    <div className={styles.plansGrid}>
                      {getPlans(d).map(plan => (
                        <div 
                          key={plan.id}
                          className={`${styles.planCard} ${selectedPlan === plan.id ? styles.planActive : ""}`}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          <div className={styles.planInfo}>
                            <header className={styles.planTitleBox}>
                              <span className={styles.planIcon}>{plan.icon}</span>
                              <h4>{plan.title}</h4>
                            </header>
                            <p className={styles.planDesc}>{plan.desc}</p>
                          </div>
                          
                          <div className={styles.planFeatures}>
                            <ul className={styles.featureList}>
                              {plan.features.map((f: string, i: number) => (
                                <li key={i}><span>▹</span> {f}</li>
                              ))}
                            </ul>
                          </div>

                          <div className={styles.planPriceArea}>
                            <span className={styles.startingAtLabel}>{d.starting_at}</span>
                            <span className={styles.planPrice}>{formatPrice(plan.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STAGE 2: TACTICAL SERVICES */}
                {step === 2 && category !== "systems" && (
                  <div className={styles.globalStep2}>
                    {(category === "flash" || category === "growth" || category === "ai" || category === "audit") && (
                      <div className={styles.servicesGrid}>
                        {getTacticalServices(d, category).map(service => (
                          <div 
                            key={service.id}
                            className={`${styles.tacticalCard} ${selectedTactical === service.id ? styles.tacticalActive : ""}`}
                            onClick={() => setSelectedTactical(service.id)}
                          >
                            <div className={styles.tacticalHeader}>
                              <div className={styles.tacticalIcon}>{service.icon}</div>
                              <div className={styles.tacticalTitle}>
                                <h4>{service.title}</h4>
                                <p>{service.desc}</p>
                              </div>
                              <div className={styles.tacticalCheck}>
                                {selectedTactical === service.id && <Check size={16} />}
                              </div>
                            </div>
                            <div className={styles.tacticalPrice}>{formatPrice(service.price)}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {category === "support" && (
                      <div className={styles.tacticalGrid}>
                        {getMaintenanceServices(d).map(service => (
                          <div 
                            key={service.id}
                            className={`${styles.tacticalCard} ${selectedMaintenance === service.id ? styles.tacticalActive : ""}`}
                            onClick={() => setSelectedMaintenance(service.id)}
                          >
                            <div className={styles.tacticalHeader}>
                              <div className={styles.tacticalIcon}>{service.icon}</div>
                              <div className={styles.tacticalTitle}>
                                <h4>{service.title}</h4>
                                <p>{service.desc}</p>
                              </div>
                            </div>
                            <div className={styles.tacticalPrice}>
                              {formatPrice(service.price)} <span className="text-xs text-muted">/ MES</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STAGE 3: GLOBAL ADDONS */}
                {step === 3 && (
                  <div className={styles.globalAddonsStep}>
                    <div className={styles.addonsGrid}>
                      {getAddons(d, category).map((addon: any) => (
                        <div 
                          key={addon.id}
                          className={`${styles.addonItem} ${selectedAddons.includes(addon.id) ? styles.addonActive : ""}`}
                          onClick={() => handleAddonToggle(addon.id)}
                        >
                          <div className={styles.addonCheck}>
                            {selectedAddons.includes(addon.id) && <Check size={14} />}
                          </div>
                          <div className={styles.addonInfo}>
                            <h5>{addon.title}</h5>
                            <p>{addon.desc}</p>
                          </div>
                          <span className={styles.addonPrice}>+{formatPrice(addon.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STAGE 4: INTELLIGENCE & ARCHITECTURE */}
                {step === 4 && (() => {
                  const catData = d.dynamic_intelligence[category || "systems"];
                  const subId = category === "systems" ? selectedPlan : (selectedTactical || "default");
                  const intel = catData[subId] || catData.default;
                  const blueprintOpts = d.blueprints[category || "systems"];
                  const fallback = {
                    objective: "Project Objective",
                    objective_placeholder: "Describe your goal...",
                    audience: "Target Audience",
                    audience_placeholder: "Who is this for?",
                    benchmarks: "Reference Systems",
                    benchmarks_placeholder: "URLs or competitor names..."
                  };

                  const tabs = [
                    { id: 0, label: lang === 'es' ? 'IDENTIDAD' : 'IDENTITY', icon: <Fingerprint size={14} /> },
                    { id: 1, label: d.tabs.briefing, icon: <Target size={14} /> },
                    { id: 2, label: d.tabs.blueprint, icon: <Terminal size={14} /> },
                    { id: 3, label: d.tabs.uplink, icon: <LinkIcon size={14} /> }
                  ];

                  return (
                    <div className={styles.stageCockpit}>
                      <div className={styles.subNavBriefing}>
                        {tabs.map((tab) => (
                          <div
                            key={tab.id}
                            className={`${styles.navTabBriefing} ${activeSubStep === tab.id ? styles.navTabBriefingActive : ""}`}
                            onClick={() => setActiveSubStep(tab.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <span className={styles.tabIndexBriefing}>0{tab.id + 1}</span>
                            <div className={styles.tabBriefingIcon}>{tab.icon}</div>
                            <label style={{ cursor: 'pointer' }}>{tab.label}</label>
                          </div>
                        ))}
                      </div>

                      <div className={styles.tabContent}>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeSubStep}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className={styles.fieldsGrid}
                          >
                            {activeSubStep === 0 && (
                              <>
                                <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Fingerprint size={14} /></div>
                                    <label>{lang === 'es' ? 'NOMBRE DEL PROYECTO' : 'PROJECT NAME'} <span className={styles.requiredStar}>*</span></label>
                                    <span className={styles.fieldMeta}>ID-04Z</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <input 
                                      type="text"
                                      placeholder={lang === 'es' ? 'Ej: "Rediseño de Portal", "Proyecto Omega"' : 'e.g. "Portal Redesign", "Project Omega"'}
                                      value={discovery.projectName}
                                      maxLength={100}
                                      onChange={e => setDiscovery({...discovery, projectName: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className={styles.fieldGroup}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Users size={14} /></div>
                                    <label>{lang === 'es' ? 'CLIENTE / LEAD' : 'CLIENT / LEAD'}</label>
                                    <span className={styles.fieldMeta}>ID-04Y</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <input 
                                      type="text"
                                      placeholder={lang === 'es' ? 'Nombre del responsable' : "Lead agent's name"}
                                      value={discovery.clientName}
                                      maxLength={200}
                                      onChange={e => setDiscovery({...discovery, clientName: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className={styles.fieldGroup}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Globe size={14} /></div>
                                    <label>{lang === 'es' ? 'ORGANIZACIÓN' : 'ORGANIZATION'}</label>
                                    <span className={styles.fieldMeta}>ID-04X</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <input 
                                      type="text"
                                      placeholder={lang === 'es' ? 'Empresa / Freelance' : 'Company / Freelance'}
                                      value={discovery.company}
                                      maxLength={200}
                                      onChange={e => setDiscovery({...discovery, company: e.target.value})}
                                    />
                                  </div>
                                </div>
                              </>
                            )}

                            {activeSubStep === 1 && (
                              <>
                                <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Target size={14} /></div>
                                    <label>{intel.objective || fallback.objective} <span className={styles.requiredStar}>*</span></label>
                                    <span className={styles.fieldMeta}>INTEL-04A</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <textarea 
                                      placeholder={intel.objective_placeholder || fallback.objective_placeholder}
                                      value={intelligence.objective}
                                      maxLength={2000}
                                      onChange={e => setIntelligence({...intelligence, objective: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className={styles.fieldGroup}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Users size={14} /></div>
                                    <label>{intel.audience || fallback.audience} <span className={styles.requiredStar}>*</span></label>
                                    <span className={styles.fieldMeta}>DATA-04B</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <input 
                                      type="text"
                                      placeholder={intel.audience_placeholder || fallback.audience_placeholder}
                                      value={intelligence.audience}
                                      maxLength={500}
                                      onChange={e => setIntelligence({...intelligence, audience: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className={styles.fieldGroup}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Globe size={14} /></div>
                                    <label>{intel.benchmarks || fallback.benchmarks}</label>
                                    <span className={styles.fieldMeta}>REF-04C</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <input 
                                      type="text"
                                      placeholder={intel.benchmarks_placeholder || fallback.benchmarks_placeholder}
                                      value={intelligence.benchmarks}
                                      maxLength={500}
                                      onChange={e => setIntelligence({...intelligence, benchmarks: e.target.value})}
                                    />
                                  </div>
                                </div>
                              </>
                            )}

                            {activeSubStep === 2 && (
                              <>
                                <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Hash size={14} /></div>
                                    <label>{d.fields.project_type} <span className={styles.requiredStar}>*</span></label>
                                    <span className={styles.fieldMeta}>TYPE-04D</span>
                                  </div>
                                  <div className={styles.cockpitSelect}>
                                    <select 
                                      value={blueprint.type}
                                      onChange={e => setBlueprint({...blueprint, type: e.target.value})}
                                    >
                                      <option value="">{lang === 'es' ? '-- Seleccionar --' : '-- Select Type --'}</option>
                                      {blueprintOpts.types.map((t: any) => (
                                        <option key={t} value={t}>{t}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><Terminal size={14} /></div>
                                    <label>{d.fields.tech_tools} <span className={styles.requiredStar}>*</span></label>
                                    <span className={styles.fieldMeta}>STACK-04E</span>
                                  </div>
                                  <div className={styles.techStacksWrapper}>
                                    {blueprintOpts.stacks.map((catGroup: any, catIdx: number) => (
                                      <div key={catIdx} className={styles.techCategoryBlock}>
                                        <h4 className={styles.techCategoryLabel}>
                                          <span className={styles.techCategoryIndex}>[ 0{catIdx + 1} ]</span>
                                          {catGroup.label}
                                        </h4>
                                        <div className={styles.techPillContainer}>
                                          {catGroup.items.map((tech: any) => (
                                            <button
                                              key={tech.name}
                                              className={`${styles.techPill} ${blueprint.stack.includes(tech.name) ? styles.techPillActive : ""}`}
                                              onClick={() => handleTechToggle(tech.name)}
                                            >
                                              <div className={styles.pillSymbolWrapper}>
                                                <span className={styles.pillSymbol}>{tech.symbol}</span>
                                              </div>
                                              <span className={styles.pillLabel}>{tech.name}</span>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    
                                    <div className={styles.techCategoryBlock}>
                                      <button
                                        className={`${styles.techPill} ${styles.recommendPill} ${blueprint.needRecommendation ? styles.techPillActive : ""}`}
                                        onClick={() => setBlueprint({...blueprint, stack: [], needRecommendation: true, customTech: ""})}
                                      >
                                        <div className={styles.pillSymbolWrapper}>
                                          <span className={styles.pillSymbol}>✦</span>
                                        </div>
                                        <span className={styles.pillLabel}>{d.fields.tech_recommend}</span>
                                      </button>
                                    </div>
                                  </div>
                                  <div className={styles.customTechBox}>
                                    <input 
                                      type="text"
                                      placeholder={"[+] " + d.fields.tech_other}
                                      value={blueprint.customTech}
                                      maxLength={200}
                                      onChange={e => setBlueprint({...blueprint, customTech: e.target.value, needRecommendation: false})}
                                    />
                                  </div>
                                </div>
                              </>
                            )}

                            {activeSubStep === 3 && (
                              <>
                                <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                                  <div className={styles.fieldHeader}>
                                    <div className={styles.fieldIcon}><LinkIcon size={14} /></div>
                                    <label>{d.fields.asset_upload}</label>
                                    <span className={styles.fieldMeta}>UPLINK-04F</span>
                                  </div>
                                  <div className={styles.fieldCockpit}>
                                    <input 
                                      type="text"
                                      placeholder={d.fields.asset_url_placeholder}
                                      value={intelligence.assetLinks}
                                      maxLength={1000}
                                      onChange={e => setIntelligence({...intelligence, assetLinks: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className={`${styles.assetTransferSection} ${styles.fullWidthField}`}>
                                  <div className={styles.uploadTerminal} onClick={() => alert('Secure data link established.')}>
                                    <div className={styles.terminalScanline} />
                                    <div className={styles.terminalIcon}><FileText size={24} /></div>
                                    <div className={styles.terminalContent}>
                                      <p>{d.fields.asset_upload_desc}</p>
                                      <span>{lang === 'es' ? 'PDF, PNG, JPG o Briefing Docs' : 'PDF, PNG, JPG, or Briefing Docs'}</span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })()}

                {/* STAGE 5: LOGISTICS */}
                {step === 5 && (
                  <div className={styles.stageCockpit}>
                    <div className={styles.tabContent}>
                      <div className={styles.fieldsGrid}>
                        <div className={styles.fieldGroup}>
                          <div className={styles.fieldHeader}>
                            <div className={styles.fieldIcon}><Calendar size={14} /></div>
                            <label>{d.fields.start_date} <span className={styles.requiredStar}>*</span></label>
                            <span className={styles.fieldMeta}>LOG-05A</span>
                          </div>
                          <div className={styles.fieldCockpit}>
                            <input 
                              type="date" 
                              value={logistics.startDate}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => setLogistics({...logistics, startDate: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <div className={styles.fieldHeader}>
                            <div className={styles.fieldIcon}><Calendar size={14} /></div>
                            <label>{d.fields.end_date} <span className={styles.requiredStar}>*</span></label>
                            <span className={styles.fieldMeta}>LOG-05B</span>
                          </div>
                          <div className={styles.fieldCockpit}>
                            <input 
                              type="date" 
                              value={logistics.endDate}
                              min={logistics.startDate || new Date().toISOString().split('T')[0]}
                              onChange={(e) => setLogistics({...logistics, endDate: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <div className={styles.fieldHeader}>
                            <div className={styles.fieldIcon}><MessageSquare size={14} /></div>
                            <label>{d.fields.comm_pref} <span className={styles.requiredStar}>*</span></label>
                            <span className={styles.fieldMeta}>LOG-05C</span>
                          </div>
                          <div className={styles.cockpitSelect}>
                            <select 
                              value={logistics.commChannel}
                              onChange={(e) => setLogistics({...logistics, commChannel: e.target.value})}
                            >
                              <option value="zoom">{d.comm_options.zoom}</option>
                              <option value="google_meet">{d.comm_options.google_meet}</option>
                              <option value="discord">{d.comm_options.discord}</option>
                              <option value="slack">{d.comm_options.slack}</option>
                            </select>
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <div className={styles.fieldHeader}>
                            <div className={styles.fieldIcon}><Lock size={14} /></div>
                            <label>{d.fields.privacy_level}</label>
                            <span className={styles.fieldMeta}>LOG-05D</span>
                          </div>
                          <div className={styles.privacySwitcher}>
                            <button 
                              className={`${styles.privacyOpt} ${!logistics.isPrivate ? styles.privacyOptActive : ""}`}
                              onClick={() => setLogistics({...logistics, isPrivate: false})}
                            >
                              {d.fields.privacy_standard}
                            </button>
                            <button 
                              className={`${styles.privacyOpt} ${logistics.isPrivate ? styles.privacyOptActive : ""}`}
                              onClick={() => setLogistics({...logistics, isPrivate: true})}
                            >
                              {d.fields.privacy_nda}
                            </button>
                          </div>
                        </div>

                        <div className={`${styles.fieldGroup} ${styles.fullWidthField}`}>
                          <div className={styles.fieldHeader}>
                            <div className={styles.fieldIcon}><Terminal size={14} /></div>
                            <label>{d.fields.repo_url}</label>
                            <span className={styles.fieldMeta}>LOG-05E</span>
                          </div>
                          <div className={styles.fieldCockpit}>
                            <input 
                              type="url" 
                              placeholder="https://github.com/user/repo"
                              value={logistics.repoUrl}
                              maxLength={500}
                              onChange={(e) => setLogistics({...logistics, repoUrl: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PHASE 6: PROJECT VALIDATION & AUTHORIZATION */}
                {step === 6 && (() => {
                  const authTabs = [
                    { id: 0, label: lang === 'es' ? 'PROTOCOLOS' : 'PROTOCOLS', icon: <ShieldCheck size={14} /> },
                    { id: 1, label: lang === 'es' ? 'INTEGRIDAD' : 'INTEGRITY', icon: <Activity size={14} /> },
                    { id: 2, label: lang === 'es' ? 'SELLO' : 'SEAL', icon: <Lock size={14} /> }
                  ];

                  const snapshot = generateProjectSnapshot();

                  return (
                    <div className={styles.phaseCockpit}>
                      <div className={styles.subNavBriefing}>
                        {authTabs.map((tab: any) => (
                          <div
                            key={tab.id}
                            className={`${styles.navTabBriefing} ${activeSubStep === tab.id ? styles.navTabBriefingActive : ""}`}
                          >
                            <span className={styles.tabIndexBriefing}>0{tab.id + 1}</span>
                            <div className={styles.tabBriefingIcon}>{tab.icon}</div>
                            <label>{tab.label}</label>
                          </div>
                        ))}
                      </div>

                      <div className={styles.tabContent}>
                        {activeSubStep === 0 && (
                          <div className={styles.protocolsSection}>
                            <h3 className={styles.authTitle}>{d.disclosure.title}</h3>
                            <p className={styles.authSubtitle}>{d.disclosure.subtitle}</p>
                            
                            <div className={styles.protocolCategories} onScroll={handleScroll}>
                              {[1, 2, 3].map((cat: any) => (
                                <div key={cat} className={styles.protocolGroup}>
                                  <h4>{d.disclosure[`cat_${cat}_title`]}</h4>
                                  <div className={styles.protocolList}>
                                    {[1, 2, 3, 4, 5, 6, 7].map((rule: any) => {
                                      const ruleIdx = (cat - 1) * 7 + rule;
                                      if (ruleIdx > 20) return null;
                                      return (
                                        <div key={ruleIdx} className={styles.ruleItem}>
                                          <div className={styles.ruleHeader}>
                                            <span className={styles.ruleNumber}>{ruleIdx.toString().padStart(2, '0')}</span>
                                            <span className={styles.ruleTitle}>{d.disclosure[`rule_${ruleIdx}_title`]}</span>
                                          </div>
                                          <p className={styles.ruleDesc}>{d.disclosure[`rule_${ruleIdx}_desc`]}</p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className={styles.authAction}>
                              <div ref={protocolsRef} className={styles.scrollSentinel} style={{ height: '1px' }} />
                              <label className={styles.checkboxLabel}>
                                <input 
                                  type="checkbox" 
                                  checked={logistics.hasAgreed}
                                  onChange={(e) => setLogistics(prev => ({ ...prev, hasAgreed: e.target.checked }))}
                                  disabled={!hasReadProtocols}
                                />
                                <span className={styles.checkboxText}>{d.fields.agreement_notice}</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {activeSubStep === 1 && (
                          <div className={styles.integrityAudit}>
                            <h3 className={styles.authTitle}>{lang === 'es' ? 'AUDITORÍA DE INTEGRIDAD' : 'DATA INTEGRITY AUDIT'}</h3>
                            <p className={styles.authSubtitle}>{lang === 'es' ? 'Verifique que la inteligencia y arquitectura capturadas sean correctas' : 'Verify that the captured intelligence and architecture are correct'}</p>

                            <div className={styles.auditFlow}>
                              {/* 00: IDENTITY MODULE */}
                              <div className={`${styles.auditModule} ${styles.fullWidthField}`} style={{ gridColumn: 'span 2' }}>
                                <div className={styles.auditModuleHeader}>
                                  <div className={styles.auditModuleIcon}><Fingerprint size={16} /></div>
                                  <span>{lang === 'es' ? 'IDENTIDAD DEL PROYECTO' : 'PROJECT IDENTITY'}</span>
                                </div>
                                <div className={styles.auditGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'PROYECTO' : 'PROJECT'}</div>
                                    <div className={styles.auditValue} style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>{snapshot.project_identity.title}</div>
                                  </div>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'CLIENTE' : 'CLIENT'}</div>
                                    <div className={styles.auditValue}>{snapshot.project_identity.client_name || 'Validated User'}</div>
                                  </div>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'ORGANIZACIÓN' : 'ORGANIZATION'}</div>
                                    <div className={styles.auditValue}>{snapshot.project_identity.organization || '--'}</div>
                                  </div>
                                </div>
                              </div>

                              {/* 01: STRATEGIC INTELLIGENCE */}
                              <div className={styles.auditModule}>
                                <div className={styles.auditModuleHeader}>
                                  <div className={styles.auditModuleIcon}><Target size={16} /></div>
                                  <span>{lang === 'es' ? 'INTELIGENCIA ESTRATÉGICA' : 'STRATEGIC INTELLIGENCE'}</span>
                                </div>
                                <div className={styles.auditGrid}>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'OBJETIVO' : 'OBJECTIVE'}</div>
                                    <div className={styles.auditValue}>{snapshot.intelligence.objective}</div>
                                  </div>
                                  {snapshot.intelligence.audience && (
                                    <div className={styles.auditDetail}>
                                      <div className={styles.auditLabel}>{lang === 'es' ? 'AUDIENCIA PARA IMPACTO' : 'TARGET AUDIENCE'}</div>
                                      <div className={styles.auditValue}>{snapshot.intelligence.audience}</div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* 02: ARCHITECTURE & STACK */}
                              <div className={styles.auditModule}>
                                <div className={styles.auditModuleHeader}>
                                  <div className={styles.auditModuleIcon}><Cpu size={16} /></div>
                                  <span>{lang === 'es' ? 'ARQUITECTURA & STACK' : 'ARCHITECTURE & STACK'}</span>
                                </div>
                                <div className={styles.auditGrid}>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'TIPO DE BLUEPRINT' : 'BLUEPRINT TYPE'}</div>
                                    <div className={styles.auditValue}>{snapshot.blueprint.architecture_type || 'Custom Engineering'}</div>
                                  </div>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'TECNOLOGÍAS' : 'TECHNOLOGIES'}</div>
                                    <div className={styles.chipCloud}>
                                      {snapshot.blueprint.stack.length > 0 ? (
                                        snapshot.blueprint.stack.map((s: any) => <span key={s} className={styles.techChip}>{s}</span>)
                                      ) : (
                                        <span className={styles.auditValueSecondary}>{lang === 'es' ? 'Recomendación proactiva activada' : 'Proactive recommendation enabled'}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 03: ENHANCEMENTS & INVESTMENT */}
                              <div className={styles.auditModule}>
                                <div className={styles.auditModuleHeader}>
                                  <div className={styles.auditModuleIcon}><Sparkles size={16} /></div>
                                  <span>{lang === 'es' ? 'MEJORAS & INVERSIÓN' : 'ENHANCEMENTS & INVESTMENT'}</span>
                                </div>
                                <div className={styles.auditPriceBreakdown}>
                                  <div className={styles.priceItem}>
                                    <span className={styles.priceItemLabel}>{snapshot.core_offer.title}</span>
                                    <span className={styles.priceItemValue}>{formatPrice(snapshot.financials.base_price)}</span>
                                  </div>
                                  {snapshot.addons.map((a: any) => (
                                    <div key={a.id} className={styles.priceItem}>
                                      <span className={styles.priceItemLabel}>+ {a.title}</span>
                                      <span className={styles.priceItemValue}>{formatPrice(a.price)}</span>
                                    </div>
                                  ))}
                                  <div className={styles.priceItemTotal}>
                                    <span>TOTAL</span>
                                    <span>{formatPrice(snapshot.financials.total_price)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* 04: LOGÍSTICA DE DESPLIEGUE */}
                              <div className={styles.auditModule}>
                                <div className={styles.auditModuleHeader}>
                                  <div className={styles.auditModuleIcon}><LinkIcon size={16} /></div>
                                  <span>{lang === 'es' ? 'LOGÍSTICA DE DESPLIEGUE' : 'DEPLOYMENT LOGISTICS'}</span>
                                </div>
                                <div className={styles.auditGrid}>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'COMUNICACIÓN' : 'COMMUNICATION'}</div>
                                    <div className={styles.auditValue}>{snapshot.logistics.comm_channel || 'Project Hub'}</div>
                                  </div>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'PRIVACIDAD' : 'PRIVACY'}</div>
                                    <div className={styles.auditValue}>{snapshot.logistics.is_private ? 'NDA Protocol Active' : 'Public Portfolio Protocol'}</div>
                                  </div>
                                  <div className={styles.auditDetail}>
                                    <div className={styles.auditLabel}>{lang === 'es' ? 'VENTANA DE EJECUCIÓN' : 'EXECUTION WINDOW'}</div>
                                    <div className={styles.auditValueSecondary}>
                                      {snapshot.logistics.start_date} <ArrowRight size={10} /> {snapshot.logistics.endDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSubStep === 2 && (
                          <div className={styles.finalLockdown}>
                            <div className={styles.sealIcon}>
                              <div className={styles.lockPulse} />
                              <Lock size={64} />
                            </div>
                            <h3 className={styles.authTitle}>{lang === 'es' ? 'AUTORIZACIÓN FINAL' : 'FINAL AUTHORIZATION'}</h3>
                            <p className={styles.authSubtitle}>
                              {lang === 'es' 
                                ? 'Al proceder, este proyecto será enviado al departamento de ingeniería para su validación inmediata.' 
                                : 'By proceeding, this project will be sent to the engineering department for immediate validation.'}
                            </p>
                            <div className={styles.sealWarning}>
                              <ShieldAlert size={16} />
                              <span>{lang === 'es' ? 'Esta acción sellará el briefing y no podrá ser editado durante la revisión.' : 'This action will seal the briefing and it cannot be edited during the review.'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <footer className={styles.footer}>
                <div className={styles.footerMain}>
                  <div className={styles.footerSpacer}></div> {/* 01: Symmetry Spacer */}

                  <div className={styles.navBtns}>
                    <AnimatePresence>
                      {!canProceed && (
                        <motion.div 
                          className={styles.validationHint}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                        >
                          <AlertCircle size={12} className={styles.hintIcon} />
                          {getValidationHint()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {step > 1 && (
                      <button 
                        className={styles.backBtn}
                        onClick={handleBack}
                      >
                        {d.steps.back_cta}
                      </button>
                    )}
                    <button 
                      className="btn-primary"
                      onClick={handleNext}
                      disabled={status === "loading" || !canProceed}
                    >
                      {status === "loading" ? "..." : (
                        step === 6 ? (
                          activeSubStep < 2 
                           ? (lang === 'es' ? 'AVANZAR PROTOCOLO →' : 'ADVANCE PROTOCOL →')
                           : d.steps.finish_cta
                        ) : (
                          step === 4 && activeSubStep < 2 
                            ? (lang === 'es' ? 'SIGUIENTE PASO →' : 'NEXT STEP →')
                            : d.steps.proceed_cta
                        )
                      )}
                    </button>
                  </div>

                  <div className={styles.totalBox}> {/* 03: Financial Summary */}
                    <div className={styles.totalLabel}>{lang === 'es' ? 'VALOR ESTIMADO' : 'ESTIMATED VALUE'}</div>
                    <div className={styles.totalValue}>{formatPrice(totalPrice)}</div>
                  </div>
                </div>

                <div className={styles.globalScopeNote}>
                  {d.scope_note}
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
