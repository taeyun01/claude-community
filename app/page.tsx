import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/nav/Header";
import HomeHeaderAuthAction from "@/components/nav/HomeHeaderAuthAction";
import WriteButton from "@/components/nav/WriteButton";
import FeedItem from "@/components/post/FeedItem";
import SearchInput from "@/components/post/SearchInput";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function escapeIlikeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const keyword = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  const supabase = await createClient();
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  let postsQuery = supabase
    .from("posts")
    .select(
      "id, title, content, created_at, user_id, profiles(nickname, avatar_url), likes(user_id), comments(id, deleted_at)",
    )
    .order("created_at", { ascending: false });

  if (keyword) {
    const escaped = escapeIlikeFilterValue(keyword);
    postsQuery = postsQuery.or(
      `title.ilike."%${escaped}%",content.ilike."%${escaped}%"`,
    );
  }

  const [{ data: posts }, { data: myProfile }] = await Promise.all([
    postsQuery,
    user
      ? supabase
          .from("profiles")
          .select("nickname, avatar_url")
          .eq("id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const myNickname = myProfile?.nickname ?? "알 수 없음";
  const myAvatarUrl = myProfile?.avatar_url ?? null;

  return (
    <div className="min-h-full">
      <Header
        title=""
        showBack={false}
        leftSlot={
          isLoggedIn ? (
            <Link href="/my" className="flex items-center gap-2">
              {myAvatarUrl ? (
                <Image
                  src={myAvatarUrl}
                  alt={myNickname}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
                  {myNickname.slice(0, 1)}
                </div>
              )}
              <span className="font-poppins text-sm font-semibold text-gray-900">
                {myNickname}
              </span>
            </Link>
          ) : undefined
        }
        rightSlot={<HomeHeaderAuthAction isLoggedIn={isLoggedIn} />}
      />
      <Suspense fallback={null}>
        <SearchInput />
      </Suspense>
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
          <p className="text-sm text-gray-500">
            {keyword ? "검색 결과가 없어요" : "아직 게시글이 없어요."}
          </p>
        </div>
      )}
      <WriteButton />
    </div>
  );
}
