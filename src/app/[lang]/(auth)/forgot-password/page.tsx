import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  return (
    <div className="auth-container">
      <ForgotPasswordForm dict={dict} lang={lang} />
    </div>
  );
}
