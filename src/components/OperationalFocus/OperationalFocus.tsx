"use client";

import React from "react";
import styles from "./OperationalFocus.module.css";
import type { Dictionary } from "@/types/dictionary";

interface OperationalFocusProps {
  dict: Dictionary["services"];
}

export default function OperationalFocus({ dict }: OperationalFocusProps) {
  return (
    <section id="services" className={styles.focusSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{dict.title}</h2>
        
        <div className={styles.grid}>
          {dict.items.map((item) => (
            <div key={item.id} className={styles.focusCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} energy-bloom`}>
                  <span className={styles.icon}>{item.icon}</span>
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
              </div>
              <p className={styles.cardDescription}>{item.description}</p>
              <div className={styles.cardFooter}>
                <div className={styles.statusIndicator}></div>
                <span className={styles.statusText}>Production-Grade</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
