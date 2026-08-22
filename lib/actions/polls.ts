"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

export async function votePoll(
  pollId: string,
  optionId: string,
  postId: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("poll_votes").insert({
    poll_id: pollId,
    option_id: optionId,
    user_id: user.id,
  });

  if (error) {
    return { error: "투표 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  revalidatePath(`/posts/${postId}`);
  return {};
}

export async function cancelVote(
  pollId: string,
  postId: string,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("poll_votes")
    .delete()
    .eq("poll_id", pollId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "투표 취소 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  revalidatePath(`/posts/${postId}`);
  return {};
}
