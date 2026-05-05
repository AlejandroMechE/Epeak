"use client";

import React from "react";
import styles from "./ExpertiseStack.module.css";
import type { Dictionary } from "@/types/dictionary";
import SectionHeader from "../ui/SectionHeader/SectionHeader";
import Card from "../ui/Card/Card";

interface ExpertiseStackProps {
  dict: Dictionary["expertise"];
}

interface ExpertiseCardProps {
  id: string;
  title: string;
  skills: Array<{ name: string; symbol: string }>;
}

const CategoryIcon = ({ id }: { id: string }) => {
  const strokeColor = "url(#icon-gradient)";
  const size = 32;

  const icons: Record<string, React.ReactNode> = {
    ai: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.5 9H21L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9H9.5L12 2Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke={strokeColor} strokeWidth="1.5"/>
      </svg>
    ),
    backend: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    frontend: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke={strokeColor} strokeWidth="1.5"/>
        <path d="M8 21H16" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 17V21" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    data: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C16.4183 21 20 18.7614 20 16C20 13.2386 16.4183 11 12 11C7.58172 11 4 13.2386 4 16C4 18.7614 7.58172 21 12 21Z" stroke={strokeColor} strokeWidth="1.5"/>
        <path d="M12 13C16.4183 13 20 10.7614 20 8C20 5.23858 16.4183 3 12 3C7.58172 3 4 5.23858 4 8C4 10.7614 7.58172 13 12 13Z" stroke={strokeColor} strokeWidth="1.5"/>
        <path d="M20 8V16" stroke={strokeColor} strokeWidth="1.5"/>
        <path d="M4 8V16" stroke={strokeColor} strokeWidth="1.5"/>
      </svg>
    )
  };

  return (
    <div className={styles.iconContainer}>
      <svg width="0" height="0" className={styles.svgFilters} style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-hover)" />
          </linearGradient>
        </defs>
      </svg>
      {icons[id] || icons.ai}
    </div>
  );
};

const ExpertiseCard = ({ id, title, skills }: ExpertiseCardProps) => (
  <Card key={id} className={styles.expertiseCard} hoverable={true} variant="solid">
    <div className={styles.iconHeader}>
      <div className={styles.mainIconWrapper}>
        <CategoryIcon id={id} />
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
    </div>
    
    <div className={styles.badgeGrid}>
      {skills.map((skill, index) => (
        <div key={index} className={styles.skillBadge}>
          <div className={styles.skillLogoWrapper}>
             <span className={styles.skillSymbol}>{skill.symbol}</span>
          </div>
          <span className={`${styles.skillName} text-gradient-filament`}>{skill.name}</span>
        </div>
      ))}
    </div>
  </Card>
);

export default function ExpertiseStack({ dict }: ExpertiseStackProps) {
  return (
    <div className={styles.expertiseGrid}>
      {dict.categories.map((category) => (
        <ExpertiseCard 
          key={category.id}
          id={category.id}
          title={category.title}
          skills={category.skills}
        />
      ))}
    </div>
  );
}
