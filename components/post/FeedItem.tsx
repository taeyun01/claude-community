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
    <div className="px-4">
      <Link
        href={`/profile/${authorId}`}
        className="mb-2 flex w-fit items-center gap-2"
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
            {authorNickname.slice(0, 1)}
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-poppins text-sm font-semibold text-gray-900">
            {authorNickname}
          </span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
      </Link>
      <Link href={`/posts/${id}`} className="block">
        <h2 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
          {hasPoll && <PollIcon />}
          {title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-gray-700">
          {content}
        </p>
      </Link>
      <div className="mt-3 flex items-center gap-4">
        <LikeButton
          postId={id}
          initialLiked={initialLiked}
          initialCount={initialCount}
          isLoggedIn={isLoggedIn}
        />
        <div className="flex items-center gap-1.5">
          <CommentIcon />
          {commentCount > 0 && (
            <span className="text-sm text-gray-500">{commentCount}</span>
          )}
        </div>
      </div>
    </div>
  );
}
