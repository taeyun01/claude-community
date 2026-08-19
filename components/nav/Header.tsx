"use client";

import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
  showBack?: boolean;
};

export default function Header({ title, showBack = true }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center border-b border-[#EBEBEB] px-4">
      {showBack ? (
        <button
          type="button"
          onClick={() => router.back()}
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
      <div className="w-8" />
    </header>
  );
}
