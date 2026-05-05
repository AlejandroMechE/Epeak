import React from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default async function UpdatePasswordPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  return (
    <div className="auth-container">
      <UpdatePasswordForm dict={dict} lang={lang} />
    </div>
  );
}
