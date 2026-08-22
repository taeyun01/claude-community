"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import type { Theme } from "@/lib/theme";

export async function setTheme(theme: Theme) {
  const user = await getCurrentUser();
  if (!user) return;

  const supabase = await createClient();
  await supabase.from("profiles").update({ theme }).eq("id", user.id);
}
