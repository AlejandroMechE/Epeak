"use client";

import { motion } from "framer-motion";
import styles from "./MilestoneStepper.module.css";
import { Milestone, ProjectStatus } from "@/types/portal";

interface MilestoneStepperProps {
  currentStatus: ProjectStatus;
  milestones: Milestone[];
  dict: any;
}

export default function MilestoneStepper({ currentStatus, milestones, dict }: MilestoneStepperProps) {
  // Ordered stages based on logic
  const stages: ProjectStatus[] = [
    'Review', 
    'Architecture', 
    'Development', 
    'Integration', 
    'Beta', 
    'Launch'
  ];


  const activeIndex = stages.indexOf(currentStatus);

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.progressLine}>
        <motion.div 
          className={styles.pogressFill}
          initial={{ width: "0%" }}
          animate={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      <div className={styles.steps}>
        {stages.map((stage, index) => {
          const isActive = index <= activeIndex;
          const isCurrent = index === activeIndex;
          
          return (
            <div key={stage} className={`${styles.step} ${isActive ? styles.active : ""} ${isCurrent ? styles.current : ""}`}>
              <div className={styles.dotContainer}>
                <div className={styles.dot}>
                  {isCurrent && <div className={styles.glow} />}
                </div>
              </div>
              <div className={styles.labelContainer}>
                <span className={styles.label}>{stage}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
