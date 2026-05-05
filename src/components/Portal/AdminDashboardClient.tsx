"use client";

import React, { useState, useMemo } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminContextList from "./AdminContextList";
import AdminControlHub from "./AdminControlHub";
import styles from "./AdminDashboard.module.css";

interface AdminDashboardClientProps {
  clients: any[];
  generalConversations: any[];
  adminId: string;
  lang: string;
}

export type AdminMode = 'support' | 'registry' | 'terminal' | 'users' | 'security';

export default function AdminDashboardClient({ clients, generalConversations, adminId, lang }: AdminDashboardClientProps) {
  const [activeMode, setActiveMode] = useState<AdminMode>('support');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Derive middle pane items based on mode
  const contextItems = useMemo(() => {
    switch (activeMode) {
      case 'support':
        return generalConversations.map(c => ({
          ...c,
          title: `Support: ${c.client_email}`,
          client_name: c.client_name
        }));
      
      case 'registry':
      case 'terminal':
        // Flatten all projects from all clients
        return clients.flatMap(c => 
          (c.projects || []).map((p: any) => ({
            ...p,
            client_email: c.user_metadata?.email || c.email,
            client_name: c.user_metadata?.full_name || c.email
          }))
        );

      case 'users':
      case 'security':
        return clients.map(c => ({
          ...c,
          title: c.user_metadata?.full_name || c.user_metadata?.email || "Unknown User",
          subtitle: c.user_metadata?.email || c.id
        }));

      default:
        return [];
    }
  }, [activeMode, clients, generalConversations]);

  // Derive Detail Data for the Hub
  const activeProject = useMemo(() => {
    if (activeMode === 'registry' || activeMode === 'terminal') {
      for (const client of clients) {
        const project = client.projects?.find((p: any) => p.id === selectedItemId);
        if (project) return { ...project, client_id: client.id };
      }
    }
    return null;
  }, [activeMode, selectedItemId, clients]);

  const activeUser = useMemo(() => {
    if (activeMode === 'users' || activeMode === 'security') {
      return clients.find(c => c.id === selectedItemId);
    }
    return null;
  }, [activeMode, selectedItemId, clients]);

  const handleNavSelect = (mode: AdminMode) => {
    setActiveMode(mode);
    setSelectedItemId(null); // Reset selection when switching modes
  };

  const handleContextSelect = (id: string) => {
    setSelectedItemId(id);
  };

  // Derive target client for chat/actions
  const targetClientId = useMemo(() => {
    if (activeProject) return activeProject.client_id;
    if (activeUser) return activeUser.id;
    if (activeMode === 'support' && selectedItemId) {
      return generalConversations.find(c => c.id === selectedItemId)?.client_id;
    }
    return null;
  }, [activeProject, activeUser, activeMode, selectedItemId, generalConversations]);

  return (
    <div className={styles.dashboardContainer}>
      <AdminSidebar 
        activeMode={activeMode}
        onSelectMode={handleNavSelect}
      />
      
      {activeMode !== 'users' && activeMode !== 'security' && activeMode !== 'registry' && (
        <AdminContextList 
          type={activeMode === 'support' ? 'support' : 'client'}
          items={contextItems}
          selectedId={selectedItemId}
          onSelect={handleContextSelect}
          lang={lang}
        />
      )}

      <AdminControlHub 
        mode={activeMode}
        selectedId={selectedItemId}
        clientId={targetClientId}
        projectData={activeProject}
        userData={activeUser}
        users={clients}
        projects={contextItems}
        adminId={adminId}
        onSelect={handleContextSelect}
      />
    </div>
  );
}
