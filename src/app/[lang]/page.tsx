import { getDictionary } from "../../i18n/dictionaries";
import { Locale } from "../../i18n/config";
import { createClient } from "@/utils/supabase/server";
import PrimaryIntro from "../../components/PrimaryIntro/PrimaryIntro";
import ServiceManifesto from "../../components/ServiceManifesto/ServiceManifesto";
import ExpertiseStack from "../../components/ExpertiseStack/ExpertiseStack";
import AboutMe from "../../components/AboutMe/AboutMe";
import styles from "./page.module.css";
import CaseStudiesSection from "../../components/CaseStudiesSection/CaseStudiesSection";
import SectionHeader from "../../components/ui/SectionHeader/SectionHeader";
import DynamicBackground from "../../components/DynamicBackground/DynamicBackground";
import SalesEngineCTA from "../../components/SalesEngineCTA/SalesEngineCTA";
import HomeDashboard from "../../components/HomeDashboard/HomeDashboard";
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  // Parallel Fetching for optimized payload delivery
  const [userResult] = await Promise.all([
    supabase.auth.getUser(),
  ]);

  const user = userResult.data.user;
  
  let activeProject = null;
  if (user) {
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    activeProject = project;
  }

  return (
    <main className={styles.main}>
      <DynamicBackground />
      
      {activeProject ? (
        <HomeDashboard project={activeProject} lang={lang} dict={dict} />
      ) : (
        <>
          <PrimaryIntro lang={lang} dict={dict.hero} />
          <ServiceManifesto dict={dict.manifesto} solutionsDict={dict.solutions} />
        </>
      )}

      {/* Shared Sections Mapping Engineering Authority */}
      <CaseStudiesSection dict={dict.experience} ctaLabel={dict.common.view_case_study} />

      <section id="expertise" className="section-base">
        <div className="container-main">
          <SectionHeader title={dict.expertise.title} />
          <ExpertiseStack dict={dict.expertise} />
        </div>
      </section>

      <AboutMe dict={dict.about} />

      {!activeProject && <SalesEngineCTA lang={lang} dict={dict.engine} />}
    </main>
  );
}
