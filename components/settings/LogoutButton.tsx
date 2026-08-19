"use client";

import { useState, useTransition } from "react";
import ListItem from "@/components/ui/ListItem";
import ActionSheet from "@/components/ui/ActionSheet";
import { signOut } from "@/lib/actions/auth";

export default function LogoutButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <ListItem label="로그아웃" onClick={() => setOpen(true)} />
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
