"use client";

import React from "react";
import styles from "./ServiceManifesto.module.css";
import type { Dictionary } from "@/types/dictionary";
import SectionHeader from "../ui/SectionHeader/SectionHeader";
import Card from "../ui/Card/Card";

interface ServiceManifestoProps {
  dict: Dictionary["manifesto"];
  solutionsDict: Dictionary["solutions"];
}

export default function ServiceManifesto({ dict, solutionsDict }: ServiceManifestoProps) {
  // Identify highlight tokens for both languages
  const highlightToken = dict.statement.includes("precision software") 
    ? "precision software" 
    : "software de precisión";

  const parts = dict.statement.split(highlightToken);

  return (
    <section id="manifesto" className="section-base">
      <div className="container-main">
        <SectionHeader title={dict.title} />
        
        <div className={styles.content}>
          <h2 className={styles.statement}>
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {part}
                {i < parts.length - 1 && (
                  <span className={`${styles.highlight} text-gradient-filament`}>
                    {highlightToken}
                  </span>
                )}
              </React.Fragment>
            ))}
          </h2>
        </div>

        {/* Unified Solutions Grid (Horizontal 4-column) */}
        <div className={styles.solutionsGrid}>
          {solutionsDict.items.map((item, index) => (
            <Card key={item.id} className={styles.solutionCard} hoverable={true}>
              <div className={styles.cardNumber}>
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
