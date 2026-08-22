"use client";

import { useState, useTransition } from "react";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import { cancelVote, votePoll } from "@/lib/actions/polls";

type PollOption = {
  id: string;
  label: string;
  count: number;
};

type PollCardProps = {
  pollId: string;
  postId: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  myOptionId: string | null;
  isLoggedIn: boolean;
};

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF6B57"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PollCard({
  pollId,
  postId,
  question,
  options,
  totalVotes,
  myOptionId,
  isLoggedIn,
}: PollCardProps) {
  const [optionCounts, setOptionCounts] = useState(options);
  const [voteCount, setVoteCount] = useState(totalVotes);
  const [myVote, setMyVote] = useState(myOptionId);
  const [, startTransition] = useTransition();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const hasVoted = myVote !== null;
  const showResults = !isLoggedIn || hasVoted;

  const handleVote = (optionId: string) => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    setMyVote(optionId);
    setVoteCount((prev) => prev + 1);
    setOptionCounts((prev) =>
      prev.map((option) =>
        option.id === optionId
          ? { ...option, count: option.count + 1 }
          : option,
      ),
    );
    startTransition(() => {
      votePoll(pollId, optionId, postId);
    });
  };

  const handleCancelVote = () => {
    const cancelledOptionId = myVote;
    if (!cancelledOptionId) return;
    setMyVote(null);
    setVoteCount((prev) => prev - 1);
    setOptionCounts((prev) =>
      prev.map((option) =>
        option.id === cancelledOptionId
          ? { ...option, count: option.count - 1 }
          : option,
      ),
    );
    startTransition(() => {
      cancelVote(pollId, postId);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#EBEBEB] p-4">
      <p className="text-sm font-semibold text-gray-900">{question}</p>
      <div className="flex flex-col gap-2">
        {optionCounts.map((option) => {
          const percent =
            voteCount > 0 ? Math.round((option.count / voteCount) * 100) : 0;
          const isMine = option.id === myVote;

          if (!showResults) {
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleVote(option.id)}
                className="w-full cursor-pointer rounded-xl border border-[#EBEBEB] px-4 py-3 text-left text-sm text-gray-900 hover:border-brand-600"
              >
                {option.label}
              </button>
            );
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginDialog(true);
                  return;
                }
                if (isMine) {
                  handleCancelVote();
                }
              }}
              disabled={isLoggedIn && !isMine}
              className="relative w-full cursor-pointer overflow-hidden rounded-xl border border-[#EBEBEB] bg-[#F6F6F6] px-4 py-3 text-left disabled:cursor-default"
            >
              <div
                className="absolute inset-y-0 left-0 bg-brand-100"
                style={{ width: `${percent}%` }}
              />
              <div className="relative flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-sm text-gray-900">
                  {isMine && <CheckIcon />}
                  {option.label}
                </span>
                <span className="shrink-0 text-sm font-semibold text-gray-700">
                  {percent}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500">{voteCount}명 참여</p>
      {showLoginDialog && (
        <RequireLoginDialog onCancel={() => setShowLoginDialog(false)} />
      )}
    </div>
  );
}
