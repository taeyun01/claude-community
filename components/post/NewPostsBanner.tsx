"use client";

import { useState } from "react";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";

type NewPostsBannerProps = {
  count: number;
  isLoggedIn: boolean;
  onShow: () => void;
};

export default function NewPostsBanner({
  count,
  isLoggedIn,
  onShow,
}: NewPostsBannerProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    onShow();
  };

  return (
    <>
      <div className="flex justify-center px-4">
        <button
          type="button"
          onClick={handleClick}
          className="bg-brand-600 shadow-fab font-poppins cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-white"
        >
          새 게시글 보기 +{count}개
        </button>
      </div>
      {showLoginDialog && (
        <RequireLoginDialog onCancel={() => setShowLoginDialog(false)} />
      )}
    </>
  );
}
