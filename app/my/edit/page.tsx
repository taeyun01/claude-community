import { redirect } from "next/navigation";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import { getCurrentUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export default async function MyEditPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <ProfileEditForm
      initialNickname={profile?.nickname ?? ""}
      initialAvatarUrl={profile?.avatar_url ?? null}
    />
  );
}
