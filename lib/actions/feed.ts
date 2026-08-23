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
  hasPoll: boolean;
};

const FEED_SELECT =
  "id, title, content, created_at, user_id, profiles(nickname, avatar_url), likes(user_id), comments(id, deleted_at), polls(id)";

function escapeIlikeFilterValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

type FeedRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { nickname: string; avatar_url: string | null } | null;
  likes: { user_id: string }[] | null;
  comments: { id: string; deleted_at: string | null }[] | null;
  polls: { id: string }[] | null;
};

function mapFeedRow(post: FeedRow, currentUserId: string | null): FeedPost {
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
    isLiked: !!currentUserId && likeUserIds.includes(currentUserId),
    commentCount:
      post.comments?.filter((c) => c.deleted_at === null).length ?? 0,
    hasPoll: (post.polls?.length ?? 0) > 0,
  };
}

export async function fetchFeedPosts(
  keyword: string,
  cursor: string | null,
): Promise<{ posts: FeedPost[]; nextCursor: string | null }> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  let query = supabase
    .from("posts")
    .select(FEED_SELECT)
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

  const posts = rows.map((post) => mapFeedRow(post, user?.id ?? null));

  const nextCursor =
    rows.length === FEED_PAGE_SIZE ? posts[posts.length - 1].createdAt : null;

  return { posts, nextCursor };
}

export async function fetchNewPosts(since: string): Promise<FeedPost[]> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  const { data } = await supabase
    .from("posts")
    .select(FEED_SELECT)
    .gt("created_at", since)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  return rows.map((post) => mapFeedRow(post, user?.id ?? null));
}
