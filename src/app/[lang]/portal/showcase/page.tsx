import React from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TechShowcaseCard from "@/components/Portal/TechShowcaseCard";
import styles from "./ShowcaseHub.module.css";

export default async function ShowcasePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang as any);
  const supabase = await createClient();

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/auth/login`);

  const showcaseDict = dict.portal.showcase_items;

  const ITEMS = [
    {
      id: "rag",
      image: "/showcase/rag.png",
      data: showcaseDict.items.rag
    },
    {
      id: "iot",
      image: "/showcase/iot.png",
      data: showcaseDict.items.iot
    },
    {
      id: "neural",
      image: "/showcase/neural.png",
      data: showcaseDict.items.neural
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{showcaseDict.title}</h1>
        <p className={styles.subtitle}>{showcaseDict.subtitle}</p>
      </header>

      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <TechShowcaseCard 
            key={item.id}
            title={item.data.title}
            intro={item.data.intro}
            tags={item.data.tags}
            imageUrl={item.image}
            cta={item.data.cta}
          />
        ))}
      </div>
    </div>
  );
}
