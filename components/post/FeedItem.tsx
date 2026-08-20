"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";

type FeedItemProps = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorNickname: string;
  authorAvatarUrl: string | null;
  isLoggedIn: boolean;
};

export default function FeedItem({
  id,
  title,
  content,
  createdAt,
  authorNickname,
  authorAvatarUrl,
  isLoggedIn,
}: FeedItemProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const body = (
    <>
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
      <h2 className="mb-1 text-sm font-semibold text-gray-900">{title}</h2>
      <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-gray-700">
        {content}
      </p>
    </>
  );

  if (!isLoggedIn) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowLoginDialog(true)}
          className="block w-full cursor-pointer px-4 text-left"
        >
          {body}
        </button>
        {showLoginDialog && (
          <RequireLoginDialog onCancel={() => setShowLoginDialog(false)} />
        )}
      </>
    );
  }

  return (
    <Link href={`/posts/${id}`} className="block px-4">
      {body}
    </Link>
  );
}
