import { createClient } from "@/utils/supabase/server";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import { redirect } from "next/navigation";
import ProjectDashboard from "@/components/Portal/ProjectDashboard";
import { Project, ProjectDocument } from "@/types/portal";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const { p: activeId } = await searchParams;
  const dict = await getDictionary(lang);
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/${lang}/login`);
    return;
  }

  const userId = user.id;

  // Fetch ALL client projects with milestones
  const { data: projects } = await supabase
    .from("projects")
    .select("*, milestones(*)")
    .eq("client_id", userId)
    .order("created_at", { ascending: false });

  // Resolve active project from URL param or fallback to most recent
  const activeProject = (projects?.find(p => p.id === activeId) || projects?.[0]) as Project | undefined;
  const currentIndex = projects?.findIndex(p => p.id === activeProject?.id) ?? 0;

  // Fetch documents from Supabase Storage for this project
  let documents: ProjectDocument[] = [];
  if (activeProject) {
    const { data: files } = await supabase.storage
      .from("project-docs")
      .list(`${activeProject.id}/`, { sortBy: { column: "created_at", order: "desc" } });
    documents = (files as ProjectDocument[]) || [];
  }

  // Build signed URLs for each document
  const documentUrls: Record<string, string> = {};
  if (documents.length > 0 && activeProject) {
    const { data: signedUrls } = await supabase.storage
      .from("project-docs")
      .createSignedUrls(
        documents.map(d => `${activeProject.id}/${d.name}`),
        60 * 60 // 1 hour
      );
    signedUrls?.forEach(({ path, signedUrl }) => {
      if (path && signedUrl) {
        const filename = path.split("/").pop()!;
        documentUrls[filename] = signedUrl;
      }
    });
  }

  const prevProject = currentIndex > 0 ? projects?.[currentIndex - 1] : null;
  const nextProject = projects && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="container-main">
      <ProjectDashboard
        project={activeProject || null}
        projects={projects || []}
        projectIndex={currentIndex + 1}
        projectCount={projects?.length ?? 0}
        prevHref={prevProject ? `/${lang}/portal/project?p=${prevProject.id}` : null}
        nextHref={nextProject ? `/${lang}/portal/project?p=${nextProject.id}` : null}
        documents={documents}
        documentUrls={documentUrls}
        userId={userId}
        dict={dict}
        lang={lang}
      />
    </div>
  );
}
