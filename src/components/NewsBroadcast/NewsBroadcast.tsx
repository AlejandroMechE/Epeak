"use client";

import { motion } from "framer-motion";
import styles from "./NewsBroadcast.module.css";
import { Activity, Radio, Zap, ShieldAlert } from "lucide-react";

interface Broadcast {
  id: string;
  title: string;
  content: string;
  type: string;
  meta_code: string;
  created_at: string;
}

interface NewsBroadcastProps {
  broadcasts: Broadcast[];
  lang: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'technical': return <Zap size={14} />;
    case 'alert': return <ShieldAlert size={14} />;
    case 'update': return <Activity size={14} />;
    default: return <Radio size={14} />;
  }
};

export default function NewsBroadcast({ broadcasts, lang }: NewsBroadcastProps) {
  if (!broadcasts || broadcasts.length === 0) return null;

  return (
    <section className={styles.newsSection}>
      <div className="container-main">
        <div className={styles.grid}>
          {broadcasts.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={styles.newsCard}
            >
              <div className={styles.cardHeader}>
                <div className={styles.typeBadge}>
                  {getIcon(item.type)}
                  <span className={styles.typeName}>{item.type.toUpperCase()}</span>
                </div>
                <span className={styles.metaCode}>{item.meta_code || `B-0${index + 1}`}</span>
              </div>
              
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardContent}>{item.content}</p>
              
              <div className={styles.cardFooter}>
                <span className={styles.timestamp}>
                  {new Date(item.created_at).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <div className={styles.filamentLine} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
