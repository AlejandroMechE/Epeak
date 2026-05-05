import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/Portal/AdminDashboardClient";

export default async function AdminPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const supabase = await createClient();

  // 1. Double-check Auth (Layout handles most, but Page handles data safety)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${lang}/auth/login`);

  // 2. Fetch Profiles (Clients/Users)
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select(`
      id,
      user_metadata,
      role,
      is_banned,
      projects (*)
    `);

  // 3. Fetch General Conversations (Support Threads)
  const { data: supportThreads } = await supabase
    .from("conversations")
    .select(`
      id,
      client_id,
      last_message_at,
      profiles (user_metadata)
    `)
    .is("project_id", null)
    .order("last_message_at", { ascending: false });

  // Map support threads for easier client usage
  const mappedSupport = (supportThreads || []).map((t: any) => ({
    id: t.id,
    client_id: t.client_id,
    client_email: t.profiles?.user_metadata?.email || "Unknown Client",
    client_name: t.profiles?.user_metadata?.full_name || "Anonymous",
    last_message_at: t.last_message_at
  }));

  return (
    <AdminDashboardClient 
      clients={profiles || []}
      generalConversations={mappedSupport}
      adminId={user.id}
      lang={lang}
    />
  );
}
