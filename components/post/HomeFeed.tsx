"use client";

import { useEffect, useRef, useState } from "react";
import FeedItem from "@/components/post/FeedItem";
import { fetchFeedPosts, type FeedPost } from "@/lib/actions/feed";

type HomeFeedProps = {
  initialPosts: FeedPost[];
  initialNextCursor: string | null;
  keyword: string;
  isLoggedIn: boolean;
};

export default function HomeFeed({
  initialPosts,
  initialNextCursor,
  keyword,
  isLoggedIn,
}: HomeFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !nextCursor || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        setLoading(true);
        fetchFeedPosts(keyword, nextCursor).then(
          ({ posts: nextPosts, nextCursor: newCursor }) => {
            setPosts((prev) => [...prev, ...nextPosts]);
            setNextCursor(newCursor);
            setLoading(false);
          },
        );
      },
      { rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [nextCursor, loading, keyword]);

  if (posts.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-gray-500">
          {keyword ? "검색 결과가 없어요" : "아직 게시글이 없어요."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {posts.map((post) => (
        <FeedItem
          key={post.id}
          id={post.id}
          authorId={post.authorId}
          title={post.title}
          content={post.content}
          createdAt={post.createdAt}
          authorNickname={post.authorNickname}
          authorAvatarUrl={post.authorAvatarUrl}
          isLoggedIn={isLoggedIn}
          initialLiked={post.isLiked}
          initialCount={post.likeCount}
          commentCount={post.commentCount}
          hasPoll={post.hasPoll}
        />
      ))}
      <div ref={sentinelRef} />
      {loading && (
        <p className="py-2 text-center text-sm text-gray-500">불러오는 중...</p>
      )}
      {!nextCursor && !loading && (
        <p className="py-2 text-center text-sm text-gray-400">
          더 이상 불러올 게시글이 없습니다.
        </p>
      )}
    </div>
  );
}
