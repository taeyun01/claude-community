"use client";

import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import LikeButton from "@/components/post/LikeButton";
import PollIcon from "@/components/post/PollIcon";
import CommentIcon from "@/components/comment/CommentIcon";

type FeedItemProps = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  isLoggedIn: boolean;
  initialLiked: boolean;
  initialCount: number;
  commentCount: number;
  hasPoll?: boolean;
};

export default function FeedItem({
  id,
  authorId,
  title,
  content,
  createdAt,
  authorNickname,
  authorAvatarUrl,
  isLoggedIn,
  initialLiked,
  initialCount,
  commentCount,
  hasPoll = false,
}: FeedItemProps) {
  return (
    <div className="border-line bg-surface shadow-card mx-4 flex flex-col gap-3 rounded-2xl border p-4">
      <Link
        href={`/profile/${authorId}`}
        className="flex w-fit items-center gap-2"
      >
        {authorAvatarUrl ? (
          <Image
            src={authorAvatarUrl}
            alt={authorNickname}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="from-brand-100 to-brand-200 ring-brand-200 text-brand-600 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold ring-1">
            {authorNickname.slice(0, 1)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-ink-900 font-poppins text-sm font-semibold">
            {authorNickname}
          </span>
          <span className="text-ink-600 text-xs">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </Link>
      <Link href={`/posts/${id}`} className="block">
        <h2 className="text-ink-900 font-poppins mb-1 flex items-center gap-1.5 text-[15px] font-semibold">
          {hasPoll && <PollIcon />}
          {title}
        </h2>
        <p className="text-ink-900/75 line-clamp-3 text-sm leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </Link>
      <div className="flex items-center gap-4">
        <LikeButton
          postId={id}
          initialLiked={initialLiked}
          initialCount={initialCount}
          isLoggedIn={isLoggedIn}
        />
        <div className="flex items-center gap-1.5">
          <CommentIcon />
          {commentCount > 0 && (
            <span className="text-ink-600 text-sm">{commentCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
