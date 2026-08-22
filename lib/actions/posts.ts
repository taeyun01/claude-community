"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { postSchema } from "@/lib/validations/post";

export type PostState = {
  errors?: {
    title?: string[];
    content?: string[];
    pollQuestion?: string[];
    pollOptions?: string[];
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

  const pollEnabled = formData.get("pollEnabled") === "true";
  const pollQuestion = String(formData.get("pollQuestion") ?? "").trim();
  const pollOptions = formData
    .getAll("pollOptions")
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  if (pollEnabled) {
    const errors: NonNullable<PostState["errors"]> = {};
    if (!pollQuestion) {
      errors.pollQuestion = ["투표 질문을 입력해주세요."];
    }
    if (pollOptions.length < 2) {
      errors.pollOptions = ["선택지를 2개 이상 입력해주세요."];
    }
    if (Object.keys(errors).length > 0) {
      return { errors };
    }
  }

  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      title: validated.data.title,
      content: validated.data.content,
    })
    .select("id")
    .single();

  if (error || !post) {
    return { message: "글 작성 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  if (pollEnabled) {
    const { data: poll } = await supabase
      .from("polls")
      .insert({ post_id: post.id, question: pollQuestion })
      .select("id")
      .single();

    if (poll) {
      await supabase
        .from("poll_options")
        .insert(pollOptions.map((label) => ({ poll_id: poll.id, label })));
    }
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

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    redirect(`/posts/${postId}`);
  }

  redirect("/");
}
