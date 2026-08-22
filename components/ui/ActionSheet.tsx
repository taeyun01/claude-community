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
    <div className="fixed inset-0 z-30 mx-auto flex w-full max-w-md items-end">
      <button
        type="button"
        aria-label="닫기"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40"
      />
      <div className="bg-surface relative z-10 w-full rounded-t-2xl px-4 pt-5 pb-6">
        <p className="text-ink-900 mb-4 text-center text-sm font-medium">
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
            className="font-poppins text-ink-600 bg-field h-11 w-full cursor-pointer rounded-[22px] text-sm font-semibold"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
