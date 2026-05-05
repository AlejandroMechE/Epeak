import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import VerifyEmailClient from "./VerifyEmailClient";

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const { email } = await searchParams;
  const dict = await getDictionary(lang);

  return (
    <div className="auth-container">
      <div className="solid auth-card">
        <VerifyEmailClient 
          email={email || ""} 
          dict={dict.auth} 
        />
      </div>

    </div>
  );
}
