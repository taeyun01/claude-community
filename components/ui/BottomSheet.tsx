import type { ReactNode } from "react";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function BottomSheet({
  open,
  onClose,
  children,
}: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 mx-auto flex w-full max-w-md items-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative z-10 w-full rounded-t-2xl bg-white pt-2 pb-6">
        {children}
      </div>
    </div>
  );
}
