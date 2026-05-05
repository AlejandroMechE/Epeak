"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/types/dictionary";
import { signOut } from "@/features/auth/actions";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary["navigation"];
  user: any;
}

export default function Header({ lang, dict, user }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    // Initial Theme Sync
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Scrolled state for backdrop
      setIsScrolled(currentScrollY > 50);

      // Hide/Show on scroll logic
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const switchLanguage = (newLang: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLang;
    return segments.join("/");
  };

  const isAuthPage = 
    pathname.includes('/login') || 
    pathname.includes('/register') || 
    pathname.includes('/forgot-password') ||
    pathname.includes('/verify-email');

  return (
    <header 
      className={`${styles.header} ${isHidden ? styles.headerHidden : ""} ${isScrolled ? styles.headerScrolled : ""} ${isAuthPage ? styles.portalHeader : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.left}>
        {!isAuthPage && (
          <Link href={`/${lang}/#hero`} className={styles.brand}>
            ALEJANDRO VIRAMONTES <span className={styles.brandDivider}>|</span> E-PEAK
          </Link>
        )}
      </div>

      <div className={styles.center}>
        {isAuthPage && (
          <Link href={`/${lang}/#hero`} className={styles.brand}>
            ALEJANDRO VIRAMONTES <span className={styles.brandDivider}>|</span> E-PEAK
          </Link>
        )}
      </div>

      <div className={styles.right}>
        {!isAuthPage && (
          <nav className={styles.nav}>
            <Link href={`/${lang}/#hero`} className={`${styles.link}`}>{dict.home}</Link>
            <span className={styles.separator}>•</span>
            <Link href={`/${lang}/#showcase`} className={styles.link}>{dict.showcase}</Link>
            <span className={styles.separator}>•</span>
            <Link href={`/${lang}/#expertise`} className={styles.link}>{dict.expertise}</Link>
            <span className={styles.separator}>•</span>
            <Link href={`/${lang}/#about`} className={styles.link}>{dict.about}</Link>
            <span className={styles.separator}>•</span>
            <Link href={`/${lang}/#contact`} className={styles.link}>{dict.contact}</Link>
            
            {!user && (
              <>
                <span className={styles.separator}>•</span>
                <Link href={`/${lang}/login`} className={styles.link}>{dict.sign_in}</Link>
                <Link href={`/${lang}/register`} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.7rem' }}>
                  {dict.get_started}
                </Link>
              </>
            )}
          </nav>
        )}

        {!isAuthPage && (
          <div className={styles.settingsArea}>
            <button 
              className={`${styles.settingsToggle} ${isSettingsOpen ? styles.toggleActive : ""}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              aria-label="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>

            {isSettingsOpen && (
              <div className={styles.dropdown}>
                {user && (
                   <>
                    <div className={styles.dropdownSection}>
                      <Link href={`/${lang}/portal`} className={styles.menuItem}>
                        {dict.portal}
                      </Link>
                      <button onClick={() => signOut(pathname)} className={styles.menuItem}>
                        {dict.logout}
                      </button>
                    </div>
                    <div className={styles.dropdownDivider} />
                   </>
                )}
                <div className={styles.dropdownSection}>
                  <button onClick={toggleTheme} className={styles.menuItem} title="Toggle Theme">
                    {theme === "light" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    )}
                  </button>
                </div>
                <div className={styles.dropdownDivider} />
                <div className={styles.dropdownSection}>
                  <Link href={switchLanguage("en")} className={`${styles.menuItem} ${lang === "en" ? styles.active : ""}`}>
                    EN
                  </Link>
                  <Link href={switchLanguage("es")} className={`${styles.menuItem} ${lang === "es" ? styles.active : ""}`}>
                    ES
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
