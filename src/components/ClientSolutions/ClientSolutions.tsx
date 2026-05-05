"use client";

import React from "react";
import styles from "./ClientSolutions.module.css";
import type { Dictionary } from "@/types/dictionary";

interface ClientSolutionsProps {
  dict: Dictionary["solutions"];
}

import Card from "../ui/Card/Card";

export default function ClientSolutions({ dict }: ClientSolutionsProps) {
  return (
    <section className="section-base">
      <div className="container-main">
        <div className={styles.grid}>
          {dict.items.map((item, index) => (
            <Card key={item.id} className={styles.solutionCard}>
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
