"use client";

import React from "react";
import Link from "next/link";
import styles from "./SalesEngineCTA.module.css";
import type { Locale } from "@/i18n/config";
import SectionHeader from "../ui/SectionHeader/SectionHeader";
import Card from "../ui/Card/Card";

interface SalesEngineCTAProps {
  lang: Locale;
  dict: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
  };
}

export default function SalesEngineCTA({ lang, dict }: SalesEngineCTAProps) {
  return (
    <section className={`section-base ${styles.section}`}>
      <div className="container-main">
        <SectionHeader 
          title={dict.title} 
          alignment="left"
        />
        
        <div className={styles.ctaContainer}>
          <Card variant="solid" className={styles.glassCard} hoverable={true}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{dict.subtitle}</h3>
              
              <p className={styles.description}>
                {dict.description}
              </p>
              
              <div className={styles.ctaWrapper}>
                <Link 
                  href={`/${lang}/register`} 
                  className="btn-primary"
                >
                  {dict.cta}
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
