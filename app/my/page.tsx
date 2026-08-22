import Image from "next/image";
import Link from "next/link";
import Header from "@/components/nav/Header";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import FeedItem from "@/components/post/FeedItem";
import { getCurrentUser } from "@/lib/dal";
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex h-full flex-col">
        <Header title="내 정보" showBack={false} />
        <RequireLoginDialog />
      </div>
    );
  }

  const supabase = await createClient();
  const [{ data: profile }, { data: posts }] = await Promise.all([
    supabase
      .from("profiles")
      .select("nickname, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("posts")
      .select(
        "id, title, content, created_at, likes(user_id), comments(id, deleted_at), polls(id)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const nickname = profile?.nickname ?? "알 수 없음";
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="flex h-full flex-col">
      <Header title="내 정보" showBack={false} />
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center gap-3 px-4 py-8">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={nickname}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-2xl font-semibold text-brand-600">
              {nickname.slice(0, 1)}
            </div>
          )}
          <span className="font-poppins text-lg font-semibold text-gray-900">
            {nickname}
          </span>
          <Link
            href="/my/edit"
            className="rounded-full border border-brand-600 px-3 py-1 text-xs font-medium text-brand-600"
          >
            프로필 수정
          </Link>
        </div>
        <div className="border-t border-[#EBEBEB] px-4 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-gray-700">내가 쓴 글</h2>
        </div>
        {posts && posts.length > 0 ? (
          <div className="flex flex-col gap-8 py-4">
            {posts.map((post) => {
              const likeUserIds = post.likes?.map((like) => like.user_id) ?? [];
              return (
                <FeedItem
                  key={post.id}
                  id={post.id}
                  authorId={user.id}
                  title={post.title}
                  content={post.content}
                  createdAt={post.created_at}
                  authorNickname={nickname}
                  authorAvatarUrl={avatarUrl}
                  isLoggedIn
                  initialLiked={likeUserIds.includes(user.id)}
                  initialCount={likeUserIds.length}
                  commentCount={
                    post.comments?.filter((c) => c.deleted_at === null)
                      .length ?? 0
                  }
                  hasPoll={(post.polls?.length ?? 0) > 0}
                />
              );
            })}
          </div>
        ) : (
          <p className="px-4 py-8 text-center text-sm text-gray-500">
            아직 작성한 글이 없어요.
          </p>
        )}
      </div>
    </div>
  );
}
