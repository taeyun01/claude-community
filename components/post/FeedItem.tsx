"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import HeartIcon from "@/components/post/HeartIcon";
import LikeButton from "@/components/post/LikeButton";
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
}: FeedItemProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const authorHeader = (
    <div className="mb-2 flex items-center gap-2">
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
    </div>
  );

  const postBody = (
    <>
      <h2 className="mb-1 text-sm font-semibold text-gray-900">{title}</h2>
      <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-gray-700">
        {content}
      </p>
    </>
  );

  return (
    <div className="px-4">
      {isLoggedIn ? (
        <Link href={`/profile/${authorId}`} className="block w-fit">
          {authorHeader}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setShowLoginDialog(true)}
          className="block w-full cursor-pointer text-left"
        >
          {authorHeader}
        </button>
      )}
      {isLoggedIn ? (
        <Link href={`/posts/${id}`} className="block">
          {postBody}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setShowLoginDialog(true)}
          className="block w-full cursor-pointer text-left"
        >
          {postBody}
        </button>
      )}
      <div className="mt-3 flex items-center gap-4">
        {isLoggedIn ? (
          <LikeButton
            postId={id}
            initialLiked={initialLiked}
            initialCount={initialCount}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowLoginDialog(true)}
            aria-label="좋아요"
            className="flex cursor-pointer items-center gap-1.5"
          >
            <HeartIcon filled={false} />
            {initialCount > 0 && (
              <span className="text-sm text-gray-500">{initialCount}</span>
            )}
          </button>
        )}
        <div className="flex items-center gap-1.5">
          <CommentIcon />
          {commentCount > 0 && (
            <span className="text-sm text-gray-500">{commentCount}</span>
          )}
        </div>
      </div>
      {showLoginDialog && (
        <RequireLoginDialog onCancel={() => setShowLoginDialog(false)} />
      )}
    </div>
  );
}
