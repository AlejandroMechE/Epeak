"use client";

import React from "react";
import styles from "./Footer.module.css";
import type { Dictionary } from "@/types/dictionary";
import { usePathname } from "next/navigation";

interface FooterProps {
  dict: Dictionary["footer"];
  user?: any;
}

export default function Footer({ dict, user }: FooterProps) {
  const pathname = usePathname();
  
  // Hide footer if user is logged in (Portal Mode) OR on Auth pages
  const isAuthPage = 
    pathname.includes('/login') || 
    pathname.includes('/register') || 
    pathname.includes('/forgot-password') ||
    pathname.includes('/verify-email');

  if (user || isAuthPage) return null;

  const currentYear = new Date().getFullYear();
  const copyrightText = dict.copyright.replace("{year}", currentYear.toString());

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.contactSection}>
            <h2 className={styles.contactTitle}>{dict.contact_title}</h2>
            
            <div className={styles.contactLinks}>
              <a 
                href="mailto:alejandroviramontesjuarez@gmail.com" 
                className={styles.contactItem}
              >
                <span className={styles.label}>{dict.email_label}</span>
                <span className={`${styles.value} text-gradient-filament`}>
                  alejandroviramontesjuarez@gmail.com
                </span>
              </a>

              <a 
                href="https://www.linkedin.com/in/alejandro-viramontes-573aab204/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.label}>{dict.linkedin_label}</span>
                <span className={styles.value}>Alejandro Viramontes</span>
              </a>

              <div className={styles.contactItem}>
                <span className={styles.label}>{dict.branding_title}</span>
                <span className={`${styles.companyValue} text-gradient-filament`}>
                  {dict.company_name}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.navigationSection}>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className={styles.backToTop}
              aria-label={dict.back_to_top}
            >
              <span className={styles.label}>{dict.back_to_top}</span>
              <span className={styles.arrow}>↑</span>
            </button>
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>{copyrightText}</p>
          <div className={styles.designCredit}>
            Design & Engine by Alejandro Viramontes
          </div>
        </div>
      </div>
    </footer>
  );
}
