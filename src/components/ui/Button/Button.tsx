"use client";

import React from "react";
import Link from "next/link";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "filament";
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export default function Button({ 
  variant = "primary", 
  children, 
  className = "", 
  href,
  ...props 
}: ButtonProps) {
  const variantClass = variant === "filament" ? styles.btnFilament : styles.btnPrimary;
  const combinedClass = `${styles.btnBase} ${variantClass} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        <span className={styles.content}>{children}</span>
      </Link>
    );
  }
  
  return (
    <button className={combinedClass} {...props}>
      <span className={styles.content}>{children}</span>
    </button>
  );
}
