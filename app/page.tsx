import WriteButton from "@/components/nav/WriteButton";
import FeedItem from "@/components/post/FeedItem";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: posts }, user] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "id, title, content, created_at, user_id, profiles(nickname, avatar_url), likes(user_id), comments(id, deleted_at)",
      )
      .order("created_at", { ascending: false }),
    getCurrentUser(),
  ]);
  const isLoggedIn = !!user;

  return (
    <div className="min-h-full">
      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-8 py-6">
          {posts.map((post) => {
            const likeUserIds = post.likes?.map((like) => like.user_id) ?? [];
            return (
              <FeedItem
                key={post.id}
                id={post.id}
                authorId={post.user_id}
                title={post.title}
                content={post.content}
                createdAt={post.created_at}
                authorNickname={post.profiles?.nickname ?? "알 수 없음"}
                authorAvatarUrl={post.profiles?.avatar_url ?? null}
                isLoggedIn={isLoggedIn}
                initialLiked={!!user && likeUserIds.includes(user.id)}
                initialCount={likeUserIds.length}
                commentCount={
                  post.comments?.filter((c) => c.deleted_at === null).length ??
                  0
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-sm text-gray-500">아직 게시글이 없어요.</p>
        </div>
      )}
      <WriteButton />
    </div>
  );
}
