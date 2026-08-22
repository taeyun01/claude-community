"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/lib/actions/likes";
import HeartIcon from "@/components/post/HeartIcon";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";

type LikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  isLoggedIn: boolean;
};

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
  isLoggedIn,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [, startTransition] = useTransition();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((prev) => prev + (nextLiked ? 1 : -1));
    startTransition(() => {
      toggleLike(postId);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={liked}
        aria-label="좋아요"
        className="flex cursor-pointer items-center gap-1.5"
      >
        <HeartIcon filled={liked} />
        {count > 0 && (
          <span
            className={`text-sm ${liked ? "text-brand-600" : "text-gray-500"}`}
          >
            {count}
          </span>
        )}
      </button>
      {showLoginDialog && (
        <RequireLoginDialog onCancel={() => setShowLoginDialog(false)} />
      )}
    </>
  );
}
