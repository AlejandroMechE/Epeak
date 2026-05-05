"use client";

import React, { useActionState } from "react";
import { requestPasswordReset, ActionState } from "@/features/auth/actions";
import Link from "next/link";
import { AuthInput, SubmitButton } from "@/components/Auth/AuthComponents";
import styles from "../login/Login.module.css"; // Reuse shared error styles

export default function ForgotPasswordForm({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const [state, formAction] = useActionState(requestPasswordReset, null as ActionState | null);

  return (
    <div className="solid auth-card">
      <div className="auth-header">
        <h1 className="text-gradient-filament">{dict.auth.forgot_password_title}</h1>
        <p className="description">{dict.auth.forgot_password_subtitle}</p>
      </div>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="locale" value={lang} />
        
        <AuthInput
          label={dict.auth.email_label}
          name="email"
          type="email"
          placeholder={dict.auth.placeholder_email}
          required
          autoFocus
          error={state?.fieldErrors?.email}
        />

        {state?.error && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠️</span>
            {state?.error}
          </div>
        )}

        {state?.success && (
          <div className={styles.successBanner} style={{ 
            background: 'rgba(76, 175, 80, 0.1)', 
            border: '1px solid rgba(76, 175, 80, 0.3)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            color: '#4caf50', 
            fontSize: '0.85rem', 
            fontWeight: '600',
            textAlign: 'center'
          }}>
            {dict.auth.forgot_password_success}
          </div>
        )}

        <SubmitButton label={dict.auth.forgot_password_button} />
      </form>

      <div className="auth-footer">
        <p>
          <Link href={`/${lang}/login`} className="text-gradient-filament">
            {dict.auth.back_to_login}
          </Link>
        </p>
      </div>
    </div>
  );
}
