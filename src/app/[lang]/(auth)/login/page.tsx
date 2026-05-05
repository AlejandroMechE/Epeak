import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import LoginForm from "./LoginForm";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);

  return (
    <div className="auth-container">
      <LoginForm dict={dict} lang={lang} />
    </div>
  );
}
