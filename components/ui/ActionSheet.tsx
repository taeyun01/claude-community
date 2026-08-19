type ActionSheetProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ActionSheet({
  open,
  title,
  confirmLabel,
  cancelLabel = "취소",
  pending = false,
  onConfirm,
  onCancel,
}: ActionSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-20 mx-auto flex w-full max-w-md items-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative z-10 w-full rounded-t-2xl bg-white px-4 pb-6 pt-5">
        <p className="mb-4 text-center text-sm font-medium text-gray-900">
          {title}
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="font-poppins h-11 w-full rounded-[22px] cursor-pointer bg-brand-600 text-sm font-semibold text-white disabled:bg-brand-300"
          >
            {pending ? "처리 중..." : confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="font-poppins h-11 w-full rounded-[22px] cursor-pointer bg-[#F6F6F6] text-sm font-semibold text-gray-700"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
