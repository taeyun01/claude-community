"use client";

import { useActionState, useState } from "react";
import Input from "@/components/ui/Input";
import { createComment, type CommentState } from "@/lib/actions/comments";

const initialState: CommentState = {};

export default function CommentInput({ postId }: { postId: string }) {
  const action = createComment.bind(null, postId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [dismissed, setDismissed] = useState(false);
  const [prevState, setPrevState] = useState(state);

  if (state !== prevState) {
    setPrevState(state);
    setDismissed(false);
  }

  const showError = state.error && !dismissed;

  return (
    <form
      action={formAction}
      className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md border-t border-[#EBEBEB] bg-white px-4 py-3"
    >
      {showError && (
        <p className="absolute -top-7 left-4 rounded-full bg-white px-2 py-1 text-xs text-[#FF5F5F] shadow-sm">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            name="content"
            placeholder="댓글을 입력해주세요"
            className={showError ? "ring-2 ring-[#FF5F5F]" : ""}
            autoComplete="off"
            onChange={() => setDismissed(true)}
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="font-poppins h-11 shrink-0 cursor-pointer rounded-[22px] bg-brand-600 px-4 text-sm font-semibold text-white disabled:bg-brand-300"
        >
          {pending ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}
