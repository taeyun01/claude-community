"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import ActionSheet from "@/components/ui/ActionSheet";
import { signOut } from "@/lib/actions/auth";

export default function HomeHeaderAuthAction({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="font-poppins text-sm font-semibold text-brand-600"
      >
        로그인
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="로그아웃"
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 cursor-pointer items-center justify-center"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF5F5F"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
          <path d="M10 12h10m0 0-3.5-3.5M20 12l-3.5 3.5" />
        </svg>
      </button>
      <ActionSheet
        open={open}
        title="로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        pending={pending}
        onConfirm={() => startTransition(() => signOut())}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
