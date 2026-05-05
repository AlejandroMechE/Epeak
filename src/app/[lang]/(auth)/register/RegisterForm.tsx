"use client";

import React, { useActionState, useState } from "react";
import { signUp, ActionState } from "@/features/auth/actions";
import Link from "next/link";
import { AuthInput, SubmitButton, PasswordStrength } from "@/components/Auth/AuthComponents";
import styles from "./Register.module.css";

export default function RegisterForm({
  dict,
  lang,
  packageDetails,
}: {
  dict: any;
  lang: string;
  packageDetails?: string;
}) {
  const [state, formAction] = useActionState(signUp, null as ActionState | null);
  const [password, setPassword] = useState("");

  return (
    <div className="solid auth-card">
      <div className="auth-header">
        <h1 className="text-gradient-filament">{dict.auth.register_title}</h1>
        <p className="description">{dict.auth.register_subtitle}</p>
      </div>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="locale" value={lang} />
        {packageDetails && (
          <input type="hidden" name="packageDetails" value={packageDetails} />
        )}
        
        <AuthInput
          label={dict.auth.name_label}
          name="fullName"
          type="text"
          placeholder={dict.auth.placeholder_name}
          required
          autoFocus
          error={state?.fieldErrors?.fullName}
        />

        <AuthInput
          label={dict.auth.email_label}
          name="email"
          type="email"
          placeholder={dict.auth.placeholder_email}
          required
          error={state?.fieldErrors?.email}
        />

        <div className={styles.passwordArea}>
          <div onChange={(e: any) => setPassword(e.target.value)}>
            <AuthInput
              label={dict.auth.password_label}
              name="password"
              type="password"
              placeholder="••••••••"
              required
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
            {state.error === "AUTH_EMAIL_EXISTS" 
              ? dict.auth.error_email_exists 
              : state.error === "AUTH_ERROR_SIGNUP"
              ? dict.auth.error_signup
              : state.error}
          </div>
        )}

        <SubmitButton label={dict.auth.register_button} />
      </form>

      <div className="auth-footer">
        <p>
          {dict.auth.have_account}{" "}
          <Link href={`/${lang}/login`} className="text-gradient-filament">
            {dict.auth.login_button}
          </Link>
        </p>
      </div>
    </div>
  );
}
