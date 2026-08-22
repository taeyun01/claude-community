"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { commentSchema } from "@/lib/validations/comment";

export type CommentState = {
  error?: string;
};

export async function createComment(
  postId: string,
  _prevState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validated = commentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors.content?.[0] };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content: validated.data.content,
  });

  if (error) {
    return { error: "댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  revalidatePath(`/posts/${postId}`);
  return {};
}

export async function deleteComment(commentId: string, postId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .maybeSingle();

  if (!existing || existing.user_id !== user.id) {
    return;
  }

  const { error } = await supabase
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", commentId);

  if (error) {
    return;
  }

  revalidatePath(`/posts/${postId}`);
}
