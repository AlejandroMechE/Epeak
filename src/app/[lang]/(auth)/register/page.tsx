import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ packageDetails?: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const { packageDetails } = await searchParams;
  const dict = await getDictionary(lang);

  return (
    <div className="auth-container">
      <RegisterForm 
        dict={dict} 
        lang={lang} 
        packageDetails={packageDetails} 
      />
    </div>
  );
}
