"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ProjectChat from "./ProjectChat";
import AdminStepper from "./AdminStepper";
import { toggleUserBan } from "@/features/admin/user_actions";
import { syncAdminProfile } from "@/features/admin/sync_actions";
import { updateProjectApproval } from "@/features/admin/project_actions";
import { 
  Save, 
  AlertCircle, 
  Terminal as TerminalIcon, 
  MessageSquare, 
  FileText, 
  ShieldAlert, 
  Info,
  ExternalLink,
  ShieldCheck,
  Ban,
  Activity,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Eye,
  FolderOpen
} from "lucide-react";
import styles from "./AdminControlHub.module.css";

import { AdminMode } from "./AdminDashboardClient";

interface AdminControlHubProps {
  mode: AdminMode;
  selectedId: string | null;
  clientId: string | null;
  projectData?: any;
  userData?: any;
  users?: any[];
  projects?: any[];
  adminId: string;
  onSelect?: (id: string) => void;
}

type ProjectTab = 'overview' | 'chat' | 'assets' | 'terminal';

export default function AdminControlHub({ 
  mode, 
  selectedId, 
  clientId, 
  projectData, 
  userData, 
  users = [], 
  projects = [],
  adminId, 
  onSelect 
}: AdminControlHubProps) {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<ProjectTab>('overview');
  const [status, setStatus] = useState(projectData?.status || "");
  const [payload, setPayload] = useState(JSON.stringify(projectData?.payload || {}, null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectData) {
      setStatus(projectData.status);
      setPayload(JSON.stringify(projectData.payload || {}, null, 2));
    }
  }, [projectData]);

  const handleUpdateProject = async (newStatus?: string) => {
    const finalStatus = newStatus || status;
    if (!selectedId) return;
    setSaving(true);
    setError(null);
    try {
      const parsedPayload = JSON.parse(payload);
      const { error: updateError } = await supabase
        .from("projects")
        .update({ status: finalStatus, payload: parsedPayload })
        .eq("id", selectedId);
      
      if (updateError) throw updateError;
      if (newStatus) setStatus(newStatus);
    } catch (err: any) {
      setError(err.message || "Invalid JSON Payload");
    } finally {
      setSaving(false);
    }
  };

  const handleApprovalDecision = async (decision: 'approved' | 'declined') => {
    if (!selectedId) return;
    setSaving(true);
    try {
      await updateProjectApproval(selectedId, decision);
      alert(`Project ${decision === 'approved' ? 'Authorized' : 'Declined'}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBan = async () => {
    if (!userData) return;
    try {
      setSaving(true);
      await toggleUserBan(userData.id, userData.is_banned);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSyncRepair = async () => {
    setSaving(true);
    try {
      await syncAdminProfile();
      alert("System Sync Repaired. Admin profile initialized.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 1. GLOBAL PROJECT TABLE
  if (mode === 'registry' && !selectedId) {
    return (
      <div className={styles.container}>
        <div className={styles.tableHUD}>
          <div className={styles.hudHeader}>
            <div className={styles.hudTitle}>
              <Briefcase size={20} />
              <span>PROJECT COMMAND CENTER</span>
            </div>
            <div className={styles.userCount}>{projects.length} ACTIVE PROJECTS</div>
          </div>
          
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>PROJECT</th>
                <th>CLIENT</th>
                <th>BUDGET</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.noData}>NO PROJECTS INITIALIZED</td>
                </tr>
              ) : (
                projects.map(p => (
                  <tr key={p.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.userMeta}>
                        <span className={styles.userName}>{p.title}</span>
                        <span className={styles.userEmail}>ID: {p.id.split('-')[0]}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.userMeta}>
                        <span className={styles.userName}>{p.client_name}</span>
                        <span className={styles.userEmail}>{p.client_email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.roleTag}>
                        {p.total_price ? `${p.currency === 'USD' ? '$' : '€'}${p.total_price}` : 'TBD'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.statusCell}>
                        <span className={`${styles.statusDot} ${styles['dot' + p.status]}`} />
                        {p.status}
                        {p.approval_status === 'pending' && <span className={styles.pendingBadge}>REVIEW REQ.</span>}
                      </div>
                    </td>
                    <td>
                      <button className={styles.inspectBtn} onClick={() => onSelect?.(p.id)}>
                        COMMAND HUB
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. GLOBAL USER TABLE
  if (mode === 'users' && !selectedId) {
    return (
      <div className={styles.container}>
        <div className={styles.tableHUD}>
          <div className={styles.hudHeader}>
            <div className={styles.hudTitle}>
              <Users size={20} />
              <span>GLOBAL USER REGISTRY</span>
            </div>
            <div className={styles.userCount}>{users.length} TOTAL USERS</div>
          </div>
          
          {users.length === 0 ? (
            <div className={styles.desyncHUD}>
              <AlertCircle size={48} className={styles.desyncIcon} />
              <h2>DATABASE DESYNC DETECTED</h2>
              <p>No records found in the <code>public.profiles</code> table.</p>
              <button 
                className={styles.repairBtn}
                onClick={handleSyncRepair}
                disabled={saving}
              >
                {saving ? "REPAIRING..." : "REPAIR SYSTEM SYNC"}
              </button>
            </div>
          ) : (
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>IDENTITY</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className={styles.tableRow}>
                    <td>
                      <div className={styles.userMeta}>
                        <span className={styles.userName}>{u.user_metadata?.full_name || 'Anonymous'}</span>
                        <span className={styles.userEmail}>{u.user_metadata?.email || u.id}</span>
                      </div>
                    </td>
                    <td><span className={styles.roleTag}>{u.role || 'user'}</span></td>
                    <td>
                      <span className={`${styles.statusDot} ${u.is_banned ? styles.dotBanned : styles.dotActive}`} />
                      {u.is_banned ? 'BANNED' : 'ACTIVE'}
                    </td>
                    <td>
                      <button className={styles.inspectBtn} onClick={() => onSelect?.(u.id)}>
                        MANAGE SECURITY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  if (!selectedId) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyHUD}>
          <TerminalIcon size={48} className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>SYSTEM IDLE</h2>
          <p className={styles.emptyText}>SELECT A REGISTRY ENTRY TO INITIALIZE COMMAND LINK</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HUD Header with Tabs for Projects */}
      {mode === 'registry' && (
        <div className={styles.hubHeader}>
          <div className={styles.hubTabs}>
            <button className={`${styles.tab} ${activeTab === 'overview' ? styles.activeTab : ""}`} onClick={() => setActiveTab('overview')}>
              <Info size={14} /> OVERVIEW
            </button>
            <button className={`${styles.tab} ${activeTab === 'chat' ? styles.activeTab : ""}`} onClick={() => setActiveTab('chat')}>
              <MessageSquare size={14} /> CHAT
            </button>
            <button className={`${styles.tab} ${activeTab === 'assets' ? styles.activeTab : ""}`} onClick={() => setActiveTab('assets')}>
              <FolderOpen size={14} /> ASSETS
            </button>
            <button className={`${styles.tab} ${activeTab === 'terminal' ? styles.activeTab : ""}`} onClick={() => setActiveTab('terminal')}>
              <TerminalIcon size={14} /> TECHNICAL
            </button>
          </div>
          <div className={styles.hubActions}>
            <span className={styles.projectBadge}>{projectData?.title}</span>
          </div>
        </div>
      )}

      <div className={styles.hubContent}>
        {mode === 'support' && (
          <div className={styles.tabPane}>
            <ProjectChat 
              projectId={null}
              userId={clientId!} 
              isAdmin={true}
              adminId={adminId}
            />
          </div>
        )}

        {mode === 'registry' && activeTab === 'overview' && (
          <div className={styles.tabPane}>
            <div className={styles.registryHUD}>
              {projectData?.approval_status === 'pending' && (
                <div className={styles.approvalHUD}>
                  <div className={styles.approvalInfo}>
                    <ShieldCheck size={20} />
                    <div>
                      <h4>PROJECT AUTHORIZATION REQUIRED</h4>
                      <p>This project is currently in the Review phase and needs your approval to proceed to Architecture.</p>
                    </div>
                  </div>
                  <div className={styles.approvalActions}>
                    <button className={styles.approveBtn} onClick={() => handleApprovalDecision('approved')} disabled={saving}>
                      <CheckCircle size={14} /> APPROVE BUILD
                    </button>
                    <button className={styles.rejectBtn} onClick={() => handleApprovalDecision('declined')} disabled={saving}>
                      <XCircle size={14} /> DECLINE
                    </button>
                  </div>
                </div>
              )}

              <section className={styles.registrySection}>
                <div className={styles.sectionHeader}>
                  <Activity size={14} />
                  <span>LIFECYCLE CONTROL</span>
                </div>
                <AdminStepper 
                  currentStatus={status as any} 
                  onStatusChange={(s) => handleUpdateProject(s)}
                  disabled={saving}
                />
              </section>

              <section className={styles.registrySection}>
                <div className={styles.sectionHeader}>
                  <Info size={14} />
                  <span>PROJECT INTELLIGENCE</span>
                </div>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Objective</label>
                    <p>{projectData?.payload?.intelligence?.objective || "N/A"}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Audience</label>
                    <p>{projectData?.payload?.intelligence?.audience || "N/A"}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Stack</label>
                    <div className={styles.tags}>
                      {projectData?.payload?.blueprint?.stack?.map((s: string) => (
                        <span key={s} className={styles.tag}>{s}</span>
                      )) || <p>N/A</p>}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {mode === 'registry' && activeTab === 'chat' && (
          <div className={styles.tabPane}>
            <ProjectChat 
              projectId={selectedId}
              userId={projectData?.client_id}
              projectTitle={projectData?.title}
              isAdmin={true}
              adminId={adminId}
            />
          </div>
        )}

        {mode === 'registry' && activeTab === 'assets' && (
          <div className={styles.tabPane}>
            <div className={styles.assetsHUD}>
              <div className={styles.assetGrid}>
                <div className={styles.assetCard}>
                  <div className={styles.assetIcon}><TerminalIcon size={24} /></div>
                  <div className={styles.assetInfo}>
                    <h4>Source Repository</h4>
                    <p>{projectData?.payload?.logistics?.repo_url || "Not linked"}</p>
                  </div>
                  {projectData?.payload?.logistics?.repo_url && (
                    <a href={projectData.payload.logistics.repo_url} target="_blank" className={styles.assetBtn}><Eye size={14} /></a>
                  )}
                </div>
                {/* Dynamically generated assets from intelligence.assetLinks */}
                {projectData?.payload?.intelligence?.assetLinks?.split(',').map((link: string, i: number) => (
                  <div key={i} className={styles.assetCard}>
                    <div className={styles.assetIcon}><FileText size={24} /></div>
                    <div className={styles.assetInfo}>
                      <h4>External Resource {i + 1}</h4>
                      <p>{link.trim()}</p>
                    </div>
                    <a href={link.trim()} target="_blank" className={styles.assetBtn}><ExternalLink size={14} /></a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === 'registry' && activeTab === 'terminal' && (
          <div className={styles.tabPane}>
            <div className={styles.terminalHUD}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalLabel}>RAW PAYLOAD ACCESS</div>
                <button className={styles.syncBtn} onClick={() => handleUpdateProject()} disabled={saving}>
                  <Save size={14} /> {saving ? 'SYNCING...' : 'SYNC CHANGES'}
                </button>
              </div>
              <textarea 
                className={styles.payloadEditor}
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                spellCheck={false}
              />
              {error && <div className={styles.terminalError}><AlertCircle size={14} /><span>{error}</span></div>}
            </div>
          </div>
        )}

        {mode === 'users' && selectedId && (
          <div className={styles.tabPane}>
            <div className={styles.securityHUD}>
              <div className={styles.securityHeader}>
                <ShieldAlert size={32} className={userData?.is_banned ? styles.iconBanned : styles.iconActive} />
                <div className={styles.securityTitles}>
                  <h3>User Status: {userData?.is_banned ? 'BANNED' : 'ACTIVE'}</h3>
                  <p>{userData?.email || userData?.user_metadata?.email || userData?.id}</p>
                </div>
              </div>

              <div className={styles.securityActions}>
                <div className={styles.actionCard}>
                  <div className={styles.actionInfo}>
                    <Ban size={18} />
                    <div>
                      <h4>Revoke Access</h4>
                      <p>Prevents the user from entering the portal or managing projects.</p>
                    </div>
                  </div>
                  <button 
                    className={`${styles.actionBtn} ${userData?.is_banned ? styles.unbanBtn : styles.banBtn}`}
                    onClick={handleToggleBan}
                    disabled={saving}
                  >
                    {userData?.is_banned ? 'RESTORE ACCESS' : 'BAN USER'}
                  </button>
                </div>
              </div>

              <div className={styles.securityLog}>
                <div className={styles.logHeader}>SECURITY AUDIT LOG</div>
                <div className={styles.logEmpty}>NO RECENT VIOLATIONS DETECTED</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
