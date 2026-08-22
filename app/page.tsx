import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/nav/Header";
import HomeHeaderAuthAction from "@/components/nav/HomeHeaderAuthAction";
import WriteButton from "@/components/nav/WriteButton";
import HomeFeed from "@/components/post/HomeFeed";
import SearchInput from "@/components/post/SearchInput";
import { fetchFeedPosts } from "@/lib/actions/feed";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const keyword = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";

  const supabase = await createClient();
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  const [{ posts, nextCursor }, { data: myProfile }] = await Promise.all([
    fetchFeedPosts(keyword, null),
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
                <div className="from-brand-100 to-brand-200 ring-brand-200 text-brand-600 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold ring-1">
                  {myNickname.slice(0, 1)}
                </div>
              )}
              <span className="text-ink-900 font-poppins text-sm font-semibold">
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
      <HomeFeed
        key={keyword}
        initialPosts={posts}
        initialNextCursor={nextCursor}
        keyword={keyword}
        isLoggedIn={isLoggedIn}
      />
      <WriteButton />
    </div>
  );
}
