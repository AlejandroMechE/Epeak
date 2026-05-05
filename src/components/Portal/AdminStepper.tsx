"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import styles from "./AdminStepper.module.css";
import { ProjectStatus } from "@/types/portal";

interface AdminStepperProps {
  currentStatus: ProjectStatus;
  onStatusChange: (status: ProjectStatus) => void;
  disabled?: boolean;
}

export default function AdminStepper({ currentStatus, onStatusChange, disabled }: AdminStepperProps) {
  const stages: ProjectStatus[] = [
    'Discovery',
    'Architecture',
    'Development',
    'Integration',
    'Optimization',
    'Deployment',
    'Maintenance'
  ];

  const activeIndex = stages.indexOf(currentStatus);

  return (
    <div className={styles.container}>
      <div className={styles.line}>
        <motion.div 
          className={styles.fill}
          initial={false}
          animate={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      <div className={styles.steps}>
        {stages.map((stage, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;
          const isPast = index <= activeIndex;

          return (
            <button
              key={stage}
              className={`${styles.step} ${isPast ? styles.past : ""} ${isCurrent ? styles.current : ""}`}
              onClick={() => !disabled && onStatusChange(stage)}
              disabled={disabled}
              title={stage}
            >
              <div className={styles.node}>
                {isCompleted ? <Check size={10} /> : <div className={styles.dot} />}
                {isCurrent && <div className={styles.glow} />}
              </div>
              <span className={styles.label}>{stage}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
