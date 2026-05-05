"use client";

import React from "react";
import Button from "../ui/Button/Button";
import styles from "./CaseStudyCard.module.css";

interface CaseStudyCardProps {
  title: string;
  description: string;
  tags: string[];
  ctaLabel?: string;
}

import Card from "../ui/Card/Card";

export default function CaseStudyCard({ 
  title, 
  description, 
  tags, 
  ctaLabel = "VIEW CASE STUDY" 
}: CaseStudyCardProps) {
  return (
    <Card className={styles.card} hoverable={true}>
      <h3 className={styles.cardTitle}>{title}</h3>
      
      <p className={styles.cardDescription}>{description}</p>
 
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
 
      <Button variant="filament" className={styles.cardButton}>
        {ctaLabel}
      </Button>
    </Card>
  );
}
