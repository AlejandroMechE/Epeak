"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Languages, Loader2 } from "lucide-react";
import styles from "./SettingsControls.module.css";

interface SettingsControlsProps {
  lang: string;
  dict: any;
}

export default function SettingsControls({ lang, dict }: SettingsControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const switchLanguage = (newLang: string) => {
    if (newLang === lang) return;
    setSwitching(true);
    
    const segments = pathname.split("/");
    segments[1] = newLang;
    const newPath = segments.join("/");
    
    router.push(newPath);
  };

  return (
    <div className={styles.container}>
      {/* THEME CONTROL */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.iconBox}>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </div>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionLabel}>SYSTEM PHASING</span>
            <h3 className={styles.sectionTitle}>Visual Interface</h3>
          </div>
        </div>

        <div className={styles.controlRow}>
          <button 
            className={`${styles.toggleBtn} ${theme === "light" ? styles.active : ""}`}
            onClick={() => theme !== "light" && toggleTheme()}
          >
            Light Mode
          </button>
          <button 
            className={`${styles.toggleBtn} ${theme === "dark" ? styles.active : ""}`}
            onClick={() => theme !== "dark" && toggleTheme()}
          >
            Dark Mode
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      {/* LANGUAGE CONTROL */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.iconBox}>
            <Languages size={18} />
          </div>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionLabel}>LOCALIZATION LINK</span>
            <h3 className={styles.sectionTitle}>System Language</h3>
          </div>
        </div>

        <div className={styles.controlRow}>
          <button 
            className={`${styles.toggleBtn} ${lang === "en" ? styles.active : ""}`}
            onClick={() => switchLanguage("en")}
            disabled={switching}
          >
            {switching && lang !== "en" ? <Loader2 size={14} className={styles.spinner} /> : "English"}
          </button>
          <button 
            className={`${styles.toggleBtn} ${lang === "es" ? styles.active : ""}`}
            onClick={() => switchLanguage("es")}
            disabled={switching}
          >
            {switching && lang !== "es" ? <Loader2 size={14} className={styles.spinner} /> : "Español"}
          </button>
        </div>
      </div>
    </div>
  );
}
