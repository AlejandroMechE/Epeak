"use client";

import { useEffect, useState } from "react";
import { completeOnboarding } from "@/features/sales/actions";
import { useRouter } from "next/navigation";

interface OnboardingTriggerProps {
  lang: string;
  dict: any;
}

export default function OnboardingTrigger({ lang, dict }: OnboardingTriggerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trigger = async () => {
      try {
        const result = await completeOnboarding();
        if (result.success) {
          router.refresh();
        }
      } catch (err: any) {
        console.error("Onboarding failed", err);
        setError(err.message || "Failed to initialize project.");
      }
    };

    trigger();
  }, [router]);

  return (
    <div className="onboarding-overlay">
      <div className="glass onboarding-card">
        {error ? (
          <div className="error-state">
            <h3 className="error-text">Initialization Error</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : (
          <div className="loading-state">
            <div className="spinner" />
            <h3>{dict.loading}</h3>
          </div>
        )}
      </div>

      <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .onboarding-card {
          padding: 3rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 400px;
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 94, 0, 0.1);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .error-text {
          color: #ff4d4d;
        }
      `}</style>
    </div>
  );
}
