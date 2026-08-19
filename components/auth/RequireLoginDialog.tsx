"use client";

import { useRouter } from "next/navigation";
import ActionSheet from "@/components/ui/ActionSheet";

export default function RequireLoginDialog() {
  const router = useRouter();

  return (
    <ActionSheet
      open
      title="로그인이 필요합니다. 로그인 하시겠습니까?"
      confirmLabel="로그인"
      cancelLabel="취소"
      onConfirm={() => router.push("/login")}
      onCancel={() => router.push("/")}
    />
  );
}
