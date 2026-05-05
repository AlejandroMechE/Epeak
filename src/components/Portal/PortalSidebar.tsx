"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MessageSquare, ShieldAlert } from "lucide-react";
import styles from "./PortalSidebar.module.css";
import { Locale } from "@/i18n/config";

interface PortalSidebarProps {
  lang: Locale;
  dict: any;
  role?: string;
}

import { signOut } from "@/features/auth/actions";


export default function PortalSidebar({ lang, dict, role }: PortalSidebarProps) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Initial Theme Sync
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
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

  const navItems = [
    { 
      id: "dashboard", 
      href: `/${lang}/portal`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      id: "initialize", 
      href: `/${lang}/portal/initialize`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    { 
      id: "showcase", 
      href: `/${lang}/portal/showcase`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    { 
      id: "project", 
      href: `/${lang}/portal/project`, 
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      id: "chat", 
      href: `/${lang}/portal/support`, 
      icon: <MessageSquare size={18} />
    },
    ...(role === 'admin' ? [{
      id: "admin_console",
      href: `/${lang}/admin`,
      icon: <ShieldAlert size={18} className="text-accent-primary" />
    }] : [])
  ];

  const secondaryItems = [
    {
      id: "settings",
      href: `/${lang}/portal/settings`,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "sign_out",
      action: () => signOut(pathname),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <div className={styles.imageWrapper}>
          <Image 
            src="/neural-mesh-clean-Photoroom.png" 
            alt="E-PEAK Logo" 
            width={40} 
            height={40}
            className={styles.animatedLogo}
          />
        </div>
        <div className={styles.brandName}>E-PEAK</div>
      </div>

      <div className={styles.items}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.id} 
              href={item.href} 
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{dict.portal.nav[item.id]}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.bottom}>
        {secondaryItems.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const label = item.id === "sign_out" ? dict.navigation.logout : dict.portal.nav[item.id];
          
          if (item.href) {
            return (
              <Link 
                key={item.id} 
                href={item.href} 
                className={`${styles.item} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{label}</span>
              </Link>
            );
          }

          return (
            <button 
              key={item.id}
              onClick={item.action} 
              className={styles.item}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
