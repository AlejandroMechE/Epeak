"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./DynamicBackground.module.css";

export default function DynamicBackground() {
  const { scrollYProgress } = useScroll();

  // Maps scroll progress to horizontal position and blur
  // Locks the mesh in the center and reaches max blur by ~15% page scroll
  const imageLeft = useTransform(scrollYProgress, [0, 0.15], ["75vw", "50vw"]);
  const blurValue = useTransform(scrollYProgress, [0, 0.15], [0, 8]);
  const opacity = 1;
  
  // Top glow parallax
  const glowY = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className={styles.backgroundWrapper}>
      {/* Hero-specific ambient glow */}
      <motion.div 
        className={styles.ambientGlowTop}
        style={{
          y: glowY,
          opacity: glowOpacity
        }}
      />

      {/* Global Background Mesh */}
      <motion.div
        className={styles.imageWrapper}
        style={{
          top: '50%',
          left: imageLeft,
          y: '-50%',
          x: "-50%",
          opacity: opacity,
          filter: useTransform(blurValue, (v) => `blur(${v}px)`),
          position: 'fixed'
        }}
      >
        <Image
          src="/neural-mesh-clean-Photoroom.png"
          alt="Neural Network Visualization"
          width={850}
          height={850}
          priority
          className={styles.heroImage}
        />
      </motion.div>
    </div>
  );
}
