import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'solid' | 'glass' | 'cockpit';
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'solid',
  hoverable = true 
}) => {
  return (
    <div className={`
      ${styles.card} 
      ${styles[variant]} 
      ${hoverable ? styles.hoverable : ''} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
