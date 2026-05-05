import React from 'react';
import styles from './PortalHeader.module.css';

interface PortalHeaderProps {
  title: string;
  subtitle?: string;
  statusTag?: string;
  className?: string;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ 
  title, 
  subtitle, 
  statusTag,
  className = '' 
}) => {
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.status}>
        <div className={styles.statusLine} />
        <span className="status-tag">{statusTag || 'PROJECT STATUS: OPERATIONAL'}</span>
        <div className={styles.statusLine} />
      </div>

      <h1 className="text-gradient-filament">{title}</h1>
      
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
};

export default PortalHeader;
