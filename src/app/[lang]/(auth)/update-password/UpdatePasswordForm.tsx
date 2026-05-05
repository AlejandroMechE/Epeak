"use client";

import React, { useActionState, useState } from "react";
import { updatePassword, ActionState } from "@/features/auth/actions";
import { AuthInput, SubmitButton, PasswordStrength } from "@/components/Auth/AuthComponents";
import styles from "./UpdatePassword.module.css";

export default function UpdatePasswordForm({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const [state, formAction] = useActionState(updatePassword, null as ActionState | null);
  const [password, setPassword] = useState("");

  return (
    <div className="solid auth-card">
      <div className="auth-header">
        <h1 className="text-gradient-filament">{dict.auth.update_password_title}</h1>
        <p className="description">{dict.auth.update_password_subtitle}</p>
      </div>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="locale" value={lang} />
        
        <div className={styles.passwordArea}>
          <div onChange={(e: any) => setPassword(e.target.value)}>
            <AuthInput
              label={dict.auth.password_label}
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoFocus
              error={state?.fieldErrors?.password}
            />
          </div>
          <PasswordStrength 
            password={password} 
            labels={[
              dict.auth.password_strength.weak,
              dict.auth.password_strength.medium,
              dict.auth.password_strength.strong
            ]}
          />
        </div>

        {state?.error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="success-banner">
            <span className="success-icon">✓</span>
            {dict.auth.update_password_success}
          </div>
        )}

        <SubmitButton label={dict.auth.update_password_button} />
      </form>
    </div>
  );
}
