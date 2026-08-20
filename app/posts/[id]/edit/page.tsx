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
    .select("id, title, content, user_id")
    .eq("id", id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  if (post.user_id !== user.id) {
    redirect(`/posts/${id}`);
  }

  return (
    <PostForm
      mode="edit"
      postId={post.id}
      initialTitle={post.title}
      initialContent={post.content}
    />
  );
}
