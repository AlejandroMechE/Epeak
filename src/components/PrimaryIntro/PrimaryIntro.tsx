"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Locale } from "@/i18n/config";
import Button from "../ui/Button/Button";
import styles from "./PrimaryIntro.module.css";
import type { Dictionary } from "@/types/dictionary";

interface PrimaryIntroProps {
  lang: Locale;
  dict: Dictionary["hero"];
}

export default function PrimaryIntro({ lang, dict }: PrimaryIntroProps) {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section id="hero" ref={containerRef} className={styles.heroSection}>
      <div className={styles.leftColumn}>
        <div className={styles.greeting}>{dict.greeting}</div>

        <h1 className={styles.title}>
          <span className={styles.lightTitle}>{dict.title_part1}</span> <br />
          {dict.title_part2} <br />
          <span className={styles.gradientText}>{dict.title_part3 || 'SYSTEMS'}</span>
        </h1>

        <p className={styles.subtitle}>
          {dict.subtitle}
        </p>

        <div>
          <Button variant="filament" href={`/${lang}/#showcase`}>
            {dict.cta}
          </Button>
        </div>
      </div>

      <div className={styles.rightGraphicArea}>
        {/* The background mesh and glow are now handled globally by DynamicBackground */}
      </div>
    </section>
  );
}
