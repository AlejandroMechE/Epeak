"use client";

import React from "react";
import SectionHeader from "../ui/SectionHeader/SectionHeader";
import CaseStudyCard from "../CaseStudyCard/CaseStudyCard";
import type { Dictionary } from "@/types/dictionary";
import styles from "./CaseStudiesSection.module.css";

interface CaseStudiesSectionProps {
  dict: Dictionary["experience"];
  ctaLabel: string;
}

export default function CaseStudiesSection({ dict, ctaLabel }: CaseStudiesSectionProps) {
  return (
    <section id="showcase" className="section-base">
      <div className={`container-main ${styles.container}`}>
        <SectionHeader title={dict.title} />
        
        <div className={styles.horizontalGrid}>
          {dict.roles.map((role) => (
            <CaseStudyCard 
              key={role.id}
              title={role.title}
              description={role.description}
              tags={role.tags}
              ctaLabel={ctaLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
