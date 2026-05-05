import React, { useState, useMemo } from "react";
import { ChevronRight, Clock, Activity, MessageSquare, Search, User, Inbox, Box } from "lucide-react";
import styles from "./AdminContextList.module.css";

interface AdminContextListProps {
  type: 'support' | 'client' | 'users';
  items: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: string;
}

export default function AdminContextList({ type, items, selectedId, onSelect, lang }: AdminContextListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchStr = (
        (item.title || "") + 
        (item.subtitle || "") + 
        (item.client_name || "") + 
        (item.client_email || "")
      ).toLowerCase();
      return searchStr.includes(searchTerm.toLowerCase());
    });
  }, [items, searchTerm]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.label}>
            {type === 'support' ? 'ACTIVE TICKETS' : type === 'users' ? 'USER REGISTRY' : 'CLIENT PROJECTS'}
          </span>
          <h3 className={styles.title}>
            {type === 'support' ? 'Support' : type === 'users' ? 'Users' : 'Registry'}
          </h3>
        </div>

        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={`Filter ${type}...`} 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.list}>
        {filteredItems.length === 0 ? (
          <div className={styles.empty}>
            {searchTerm ? (
              <span className={styles.emptyText}>NO MATCHING RECORDS</span>
            ) : (
              <>
                <Inbox size={32} className={styles.emptyIcon} />
                <span className={styles.emptyText}>NO ACTIVE RECORDS FOUND</span>
              </>
            )}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            const isSupport = type === 'support';
            const displayTitle = isSupport ? item.client_name || 'Anonymous User' : item.title;
            const displaySubtitle = item.subtitle || item.client_email;
            
            return (
              <button 
                key={item.id}
                className={`${styles.card} ${isSelected ? styles.active : ""}`}
                onClick={() => onSelect(item.id)}
              >
                <div className={styles.cardMain}>
                  <div className={styles.cardHeader}>
                    {isSupport ? <User size={14} className={styles.typeIcon} /> : <Box size={14} className={styles.typeIcon} />}
                    <h4 className={styles.cardTitle}>{displayTitle}</h4>
                  </div>
                  {displaySubtitle && <span className={styles.cardSubtitle}>{displaySubtitle}</span>}
                  
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <Clock size={10} />
                      <span>{item.created_at || item.last_message_at ? new Date(item.created_at || item.last_message_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    {isSupport && (
                      <div className={styles.supportBadge}>SUPPORT REQ.</div>
                    )}
                    {type === 'client' && item.status && (
                      <div className={`${styles.statusBadge} ${styles[item.status?.toLowerCase()]}`}>
                        {item.status}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className={styles.chevron} />
                
                {isSelected && <div className={styles.selectionIndicator} />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
