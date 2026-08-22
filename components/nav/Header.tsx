"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

type HeaderAction = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type HeaderProps = {
  title: string;
  showBack?: boolean;
  backHref?: string;
  action?: HeaderAction;
  rightSlot?: ReactNode;
  leftSlot?: ReactNode;
};

export default function Header({
  title,
  showBack = true,
  backHref,
  action,
  rightSlot,
  leftSlot,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center border-b border-[#EBEBEB] px-4">
      {leftSlot ? (
        leftSlot
      ) : showBack ? (
        <button
          type="button"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          aria-label="뒤로가기"
          className="flex h-8 w-8 items-center justify-center"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#161616"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : (
        <div className="w-8" />
      )}
      <h1 className="font-poppins flex-1 text-center text-base font-semibold text-gray-900">
        {title}
      </h1>
      {rightSlot ? (
        rightSlot
      ) : action ? (
        <button
          type={action.type ?? "button"}
          onClick={action.onClick}
          disabled={action.disabled}
          className="font-poppins cursor-pointer px-1 text-sm font-semibold text-brand-600 disabled:text-brand-300"
        >
          {action.label}
        </button>
      ) : (
        <div className="w-8" />
      )}
    </header>
  );
}
