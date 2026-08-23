"use client";

import { useEffect, useRef, useState } from "react";
import FeedItem from "@/components/post/FeedItem";
import NewPostsBanner from "@/components/post/NewPostsBanner";
import {
  fetchFeedPosts,
  fetchNewPosts,
  type FeedPost,
} from "@/lib/actions/feed";
import { createClient } from "@/lib/supabase/client";

type HomeFeedProps = {
  initialPosts: FeedPost[];
  initialNextCursor: string | null;
  keyword: string;
  isLoggedIn: boolean;
  currentUserId: string | null;
};

export default function HomeFeed({
  initialPosts,
  initialNextCursor,
  keyword,
  isLoggedIn,
  currentUserId,
}: HomeFeedProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [loading, setLoading] = useState(false);
  const [newPostCount, setNewPostCount] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const sinceCursorRef = useRef(
    initialPosts[0]?.createdAt ?? new Date().toISOString(),
  );

  useEffect(() => {
    if (keyword) return;

    const supabase = createClient();
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const newPost = payload.new as { user_id: string };
          if (newPost.user_id === currentUserId) return;
          setNewPostCount((prev) => prev + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [keyword, currentUserId]);

  const handleShowNewPosts = () => {
    fetchNewPosts(sinceCursorRef.current).then((newPosts) => {
      setNewPostCount(0);
      if (newPosts.length === 0) return;

      sinceCursorRef.current = newPosts[0].createdAt;
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const toAdd = newPosts.filter((p) => !existingIds.has(p.id));
        return [...toAdd, ...prev];
      });
    });
  };

  const banner = newPostCount > 0 && (
    <NewPostsBanner
      count={newPostCount}
      isLoggedIn={isLoggedIn}
      onShow={handleShowNewPosts}
    />
  );

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
      <>
        {banner}
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-sm text-gray-500">
            {keyword ? "검색 결과가 없어요" : "아직 게시글이 없어요."}
          </p>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {banner}
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
