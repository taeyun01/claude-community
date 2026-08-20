"use client";

import { useOptimistic, useTransition } from "react";
import { toggleLike } from "@/lib/actions/likes";
import HeartIcon from "@/components/post/HeartIcon";

type LikeState = {
  liked: boolean;
  count: number;
};

type LikeButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
};

export default function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: LikeButtonProps) {
  const [state, setOptimisticState] = useOptimistic<LikeState, LikeState>(
    { liked: initialLiked, count: initialCount },
    (_current, next) => next,
  );
  const [, startTransition] = useTransition();

  const handleClick = () => {
    const next: LikeState = {
      liked: !state.liked,
      count: state.count + (state.liked ? -1 : 1),
    };
    startTransition(async () => {
      setOptimisticState(next);
      await toggleLike(postId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={state.liked}
      aria-label="좋아요"
      className="flex cursor-pointer items-center gap-1.5"
    >
      <HeartIcon filled={state.liked} />
      {state.count > 0 && (
        <span
          className={`text-sm ${state.liked ? "text-brand-600" : "text-gray-500"}`}
        >
          {state.count}
        </span>
      )}
    </button>
  );
}
