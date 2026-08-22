"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";

const FEED_PAGE_SIZE = 10;

export type FeedPost = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
};

function escapeIlikeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export async function fetchFeedPosts(
  keyword: string,
  cursor: string | null,
): Promise<{ posts: FeedPost[]; nextCursor: string | null }> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  let query = supabase
    .from("posts")
    .select(
      "id, title, content, created_at, user_id, profiles(nickname, avatar_url), likes(user_id), comments(id, deleted_at)",
    )
    .order("created_at", { ascending: false })
    .limit(FEED_PAGE_SIZE);

  const trimmed = keyword.trim();
  if (trimmed) {
    const escaped = escapeIlikeFilterValue(trimmed);
    query = query.or(`title.ilike."%${escaped}%",content.ilike."%${escaped}%"`);
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data } = await query;
  const rows = data ?? [];

  const posts: FeedPost[] = rows.map((post) => {
    const likeUserIds = post.likes?.map((like) => like.user_id) ?? [];
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.created_at,
      authorId: post.user_id,
      authorNickname: post.profiles?.nickname ?? "알 수 없음",
      authorAvatarUrl: post.profiles?.avatar_url ?? null,
      likeCount: likeUserIds.length,
      isLiked: !!user && likeUserIds.includes(user.id),
      commentCount:
        post.comments?.filter((c) => c.deleted_at === null).length ?? 0,
    };
  });

  const nextCursor =
    rows.length === FEED_PAGE_SIZE ? posts[posts.length - 1].createdAt : null;

  return { posts, nextCursor };
}
