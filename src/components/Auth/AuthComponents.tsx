"use client";

import React, { useState } from "react";
import { useFormStatus } from "react-dom";
import styles from "./AuthForm.module.css";

interface AuthInputProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  error?: string[];
  required?: boolean;
  autoFocus?: boolean;
}

export function AuthInput({ label, name, type, placeholder, error, required, autoFocus }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          className={error ? styles.inputError : ""}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggleVisibility}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && error.map((err, i) => (
        <span key={i} className={styles.errorText}>{err}</span>
      ))}
    </div>
  );
}

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn-primary auth-submit" disabled={pending}>
      {pending ? <span className={styles.spinner}></span> : label}
    </button>
  );
}

export function PasswordStrength({ password, labels }: { password?: string, labels?: string[] }) {
  if (!password) return null;

  const hasLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let strength = 0;
  if (hasLength) strength++;
  if (hasNumber) strength++;
  if (hasSpecial) strength++;

  const defaultLabels = ["WEAK", "MEDIUM", "SECURE"];
  const displayLabels = labels || defaultLabels;
  const colors = ["#f14644", "#ff9d00", "#4caf50"]; // Standard Red, Standard Orange, Standard Green

  return (
    <div className={styles.strengthMeter}>
      <div className={styles.strengthBar}>
        <div 
          className={styles.strengthProgress} 
          style={{ 
            width: `${(strength / 3) * 100}%`,
            backgroundColor: colors[strength - 1] || "#d2d2d7"
          }}
        ></div>
      </div>
      <span className={styles.strengthLabel} style={{ color: colors[strength - 1] }}>
        {displayLabels[strength - 1] || ""}
      </span>
    </div>
  );
}
