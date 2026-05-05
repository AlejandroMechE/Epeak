"use client";

import React, { useActionState } from "react";
import { signIn, ActionState } from "@/features/auth/actions";
import Link from "next/link";
import { AuthInput, SubmitButton } from "@/components/Auth/AuthComponents";
import styles from "./Login.module.css";
import { useSearchParams } from "next/navigation";

export default function LoginForm({
  dict,
  lang,
}: {
  dict: any;
  lang: string;
}) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || `/${lang}/portal`;
  
  const [state, formAction] = useActionState(signIn, null as ActionState | null);

  return (
    <div className="solid auth-card">
      <div className="auth-header">
        <h1 className="text-gradient-filament">{dict.auth.login_title}</h1>
        <p className="description">{dict.auth.login_subtitle}</p>
      </div>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="next" value={next} />
        
        <AuthInput
          label={dict.auth.email_label}
          name="email"
          type="email"
          placeholder={dict.auth.placeholder_email}
          required
          autoFocus
          error={state?.fieldErrors?.email}
        />

        <AuthInput
          label={dict.auth.password_label}
          name="password"
          type="password"
          placeholder="••••••••"
          required
          error={state?.fieldErrors?.password}
        />

        <div className={styles.formUtils}>
          <Link href={`/${lang}/forgot-password`} className={styles.forgotLink}>
            {dict.auth.forgot_password_link}
          </Link>
        </div>

        {(state?.error || searchParams.get("error")) && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {state?.error === "AUTH_INVALID_CREDENTIALS" 
              ? dict.auth.error_invalid 
              : (state?.error || searchParams.get("error"))}
          </div>
        )}

        <SubmitButton label={dict.auth.login_button} />
      </form>

      <div className="auth-footer">
        <p>
          {dict.auth.no_account}{" "}
          <Link href={`/${lang}/register`} className="text-gradient-filament">
            {dict.auth.register_button}
          </Link>
        </p>
      </div>
    </div>
  );
}
