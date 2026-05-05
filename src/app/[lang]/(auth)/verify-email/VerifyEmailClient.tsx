"use client";

import { useState, useEffect } from "react";
import { resendVerificationEmail } from "@/features/auth/actions";

interface VerifyEmailClientProps {
  email: string;
  dict: any;
}

export default function VerifyEmailClient({ email, dict }: VerifyEmailClientProps) {
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      await resendVerificationEmail(email);
      setStatus("success");
      setCooldown(60); // 60-second security cooldown
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Failed to resend email.");
    }
  };

  return (
    <div className="verify-content">
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="verify-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      </div>

      <h1 className="text-gradient-filament">{dict.verify_title}</h1>
      <p className="subtitle">{dict.verify_subtitle}</p>
      
      {email && <p className="email-display">{email}</p>}

      <div className="actions">
        <button
          onClick={handleResend}
          disabled={status === "loading" || cooldown > 0}
          className={`btn-primary resend-btn ${cooldown > 0 ? "disabled" : ""}`}
        >
          {status === "loading"
            ? "..."
            : cooldown > 0
            ? dict.resend_cooldown.replace("{seconds}", cooldown)
            : dict.resend_button}
        </button>

        {status === "success" && (
          <p className="success-msg">Email resent successfully!</p>
        )}
        {status === "error" && (
          <p className="error-msg">{errorMessage}</p>
        )}
      </div>

    </div>
  );
}
