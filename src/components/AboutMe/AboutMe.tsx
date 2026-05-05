"use client";

import React from "react";
import Image from "next/image";
import styles from "./AboutMe.module.css";
import type { Dictionary } from "@/types/dictionary";

interface AboutMeProps {
  dict: Dictionary["about"];
}

import SectionHeader from "../ui/SectionHeader/SectionHeader";
import Card from "../ui/Card/Card";

export default function AboutMe({ dict }: AboutMeProps) {
  return (
    <section id="about" className={`section-base ${styles.section}`}>
      <div className="container-main">
        <SectionHeader title={dict.title} />

        {/* Company Showcase Card */}
        <Card variant="solid" className={styles.companyCard} hoverable={true}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/neural-mesh-clean-Photoroom.png" 
              alt="E-PEAK Logo"
              width={400}
              height={400}
              className={styles.companyLogo}
            />
          </div>
          
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>{dict.company.name}</h3>
            <p className={styles.companyTagline}>{dict.company.tagline}</p>
            <p className={styles.companyDescription}>{dict.company.description}</p>
          </div>
        </Card>

        <SectionHeader title={dict.founderTitle} />

        {/* Identity Showcase Card (The Founder) */}
        <Card variant="solid" className={styles.identityCard} hoverable={true}>
          <div className={`${styles.imageWrapper} energy-bloom`}>
            <Image 
              src="/profile-removebg-preview.png" 
              alt="Alejandro Viramontes"
              width={300}
              height={300}
              className={styles.portrait}
            />
          </div>
          
          <div className={styles.identityInfo}>
            <h3 className={styles.name}>{dict.name}</h3>
            <p className={styles.role}>{dict.role}</p>
            <p className={styles.personalDescription}>{dict.description}</p>
            
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{dict.location_label}</span>
                <span className={styles.detailValue}>{dict.location}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{dict.citizenship_label}</span>
                <span className={styles.detailValue}>{dict.citizenship}</span>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Core Pillars Grid */}
        <div className={styles.pillarGrid}>
          {dict.pillars.map((pillar) => (
            <Card key={pillar.id} className={styles.aboutCard}>
              <div className={styles.pillarHeader}>
                <div className={styles.pillarIndicator}></div>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              </div>
              <h4 className={styles.pillarSubtitle}>{pillar.subtitle}</h4>
              <p className={styles.pillarContent}>{pillar.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
