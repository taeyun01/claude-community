"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { postSchema } from "@/lib/validations/post";

export type PostState = {
  errors?: {
    title?: string[];
    content?: string[];
  };
  message?: string;
};

export async function createPost(
  _prevState: PostState,
  formData: FormData,
): Promise<PostState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validated = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    title: validated.data.title,
    content: validated.data.content,
  });

  if (error) {
    return { message: "글 작성 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  redirect("/");
}

export async function updatePost(
  postId: string,
  _prevState: PostState,
  formData: FormData,
): Promise<PostState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validated = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .maybeSingle();

  if (!existing || existing.user_id !== user.id) {
    return { message: "수정 권한이 없습니다." };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title: validated.data.title,
      content: validated.data.content,
    })
    .eq("id", postId);

  if (error) {
    return { message: "글 수정 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("posts")
    .select("user_id")
    .eq("id", postId)
    .maybeSingle();

  if (!existing || existing.user_id !== user.id) {
    redirect(`/posts/${postId}`);
  }

  await supabase.from("posts").delete().eq("id", postId);

  redirect("/");
}
