"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import styles from "./TechShowcaseCard.module.css";

interface TechShowcaseCardProps {
  title: string;
  intro: string;
  tags: string[];
  imageUrl: string;
  cta: string;
  onEnter?: () => void;
}

export default function TechShowcaseCard({
  title,
  intro,
  tags,
  imageUrl,
  cta,
  onEnter
}: TechShowcaseCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageHUD}>
        <Image 
          src={imageUrl} 
          alt={title} 
          fill
          className={styles.image}
        />
        <div className={styles.overlay}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.onlineStatus}>
            <Zap size={10} fill="var(--accent-primary)" />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.intro}>{intro}</p>
        
        <div className={styles.tagHUD}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.enterBtn} onClick={onEnter}>
          {cta}
          <ArrowRight className={styles.btnIcon} size={16} />
        </button>
      </div>
    </div>
  );
}
