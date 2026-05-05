"use client";

import React from "react";
import { Users, MessageSquare, Box, LogOut, Terminal, ShieldAlert } from "lucide-react";
import styles from "./AdminSidebar.module.css";
import { signOut } from "@/features/auth/actions";
import { usePathname } from "next/navigation";
import { AdminMode } from "./AdminDashboardClient";

interface AdminSidebarProps {
  activeMode: AdminMode;
  onSelectMode: (mode: AdminMode) => void;
}

export default function AdminSidebar({ activeMode, onSelectMode }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>ADMIN OPS</div>
        <h2 className={styles.title}>System Control</h2>
      </div>

      <div className={styles.navGroup}>
        <div className={styles.groupLabel}>COMMUNICATIONS</div>
        <button 
          className={`${styles.navItem} ${activeMode === 'support' ? styles.active : ""}`}
          onClick={() => onSelectMode('support')}
        >
          <MessageSquare size={16} />
          <span>Support Uplink</span>
        </button>
      </div>

      <div className={styles.navGroup}>
        <div className={styles.groupLabel}>ENGINEERING</div>
        <button 
          className={`${styles.navItem} ${activeMode === 'registry' ? styles.active : ""}`}
          onClick={() => onSelectMode('registry')}
        >
          <Box size={18} />
          <span>PROJECT COMMAND</span>
        </button>
      </div>

      <div className={styles.navGroup}>
        <div className={styles.groupLabel}>ADMINISTRATION</div>
        <button 
          className={`${styles.navItem} ${activeMode === 'users' ? styles.active : ""}`}
          onClick={() => onSelectMode('users')}
        >
          <Users size={18} />
          <span>USER REGISTRY</span>
        </button>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.logoutButton}
          onClick={() => signOut(pathname)}
        >
          <LogOut size={16} />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );
}
