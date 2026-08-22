"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import BottomSheet from "@/components/ui/BottomSheet";
import ActionSheet from "@/components/ui/ActionSheet";
import MoreIcon from "@/components/ui/MoreIcon";
import { deletePost } from "@/lib/actions/posts";

export default function PostMenu({ postId }: { postId: string }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        aria-label="더보기"
        onClick={() => setMenuOpen(true)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center"
      >
        <MoreIcon />
      </button>

      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)}>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            router.push(`/posts/${postId}/edit`);
          }}
          className="flex h-12 w-full cursor-pointer items-center px-4 text-left text-sm text-gray-900"
        >
          수정하기
        </button>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            setConfirmOpen(true);
          }}
          className="flex h-12 w-full cursor-pointer items-center px-4 text-left text-sm text-[#FF5F5F]"
        >
          삭제하기
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="border-line mt-2 flex h-12 w-full cursor-pointer items-center border-t px-4 text-left text-sm text-gray-500"
        >
          취소
        </button>
      </BottomSheet>

      <ActionSheet
        open={confirmOpen}
        title="게시글을 삭제하시겠습니까?"
        confirmLabel="삭제"
        pending={pending}
        onConfirm={() => startTransition(() => deletePost(postId))}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
