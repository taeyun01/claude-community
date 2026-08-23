import { notFound, redirect } from "next/navigation";
import PostForm from "@/components/post/PostForm";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

export default async function EditPostPage(
  props: PageProps<"/posts/[id]/edit">,
) {
  const { id } = await props.params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      "id, title, content, user_id, polls(id, question, poll_options(id, label, created_at))",
    )
    .eq("id", id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  if (post.user_id !== user.id) {
    redirect(`/posts/${id}`);
  }

  const poll = post.polls?.[0] ?? null;
  const initialPoll = poll
    ? {
        question: poll.question,
        options: poll.poll_options
          .slice()
          .sort((a, b) => a.created_at.localeCompare(b.created_at))
          .map((option) => ({ id: option.id, label: option.label })),
      }
    : null;

  return (
    <PostForm
      mode="edit"
      postId={post.id}
      initialTitle={post.title}
      initialContent={post.content}
      initialPoll={initialPoll}
    />
  );
}
