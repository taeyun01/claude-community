import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/nav/Header";
import PostMenu from "@/components/post/PostMenu";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

export default async function PostDetailPage(props: PageProps<"/posts/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const [{ data: post }, user] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, content, created_at, user_id, profiles(nickname, avatar_url)",
      )
      .eq("id", id)
      .maybeSingle(),
    getCurrentUser(),
  ]);

  if (!post) {
    notFound();
  }

  if (!user) {
    return (
      <div className="flex h-full flex-col">
        <Header title="" backHref="/" />
        <RequireLoginDialog />
      </div>
    );
  }

  const authorNickname = post.profiles?.nickname ?? "알 수 없음";
  const authorAvatarUrl = post.profiles?.avatar_url ?? null;
  const isOwner = user?.id === post.user_id;

  return (
    <div className="flex h-full flex-col">
      <Header
        title=""
        backHref="/"
        rightSlot={isOwner ? <PostMenu postId={post.id} /> : undefined}
      />
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="flex items-center gap-2">
          {authorAvatarUrl ? (
            <Image
              src={authorAvatarUrl}
              alt={authorNickname}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
              {authorNickname.slice(0, 1)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-poppins text-sm font-semibold text-gray-900">
              {authorNickname}
            </span>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(post.created_at)}
            </span>
          </div>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">{post.title}</h1>
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700">
          {post.content}
        </p>
      </div>
    </div>
  );
}
