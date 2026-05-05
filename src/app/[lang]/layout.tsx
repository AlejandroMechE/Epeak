import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { i18n, Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { createClient } from "../../utils/supabase/server";

import { outfit, inter } from "../../lib/fonts";

export const metadata: Metadata = {
  title: "Alejandro Viramontes | Software & Mechanical Engineer",
  description: "Bilingual portfolio of Alejandro Viramontes, blending software engineering and mechanical depth.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return (
    <html lang={lang} className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        {!user && <Header lang={lang} dict={dict.navigation} user={user} />}
        {children}
        {!user && <Footer dict={dict.footer} user={user} />}
      </body>
    </html>
  );
}
