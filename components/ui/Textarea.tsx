import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export default function Textarea({
  label,
  error,
  id,
  className,
  ...props
}: TextareaProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="text-ink-600 mb-1.5 block text-xs font-medium"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`text-ink-900 bg-field min-h-[85px] w-full resize-none rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-[#B3A99C] focus:ring-2 focus:ring-brand-600 ${
          error ? "ring-2 ring-[#FF5F5F]" : ""
        } ${className ?? ""}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#FF5F5F]">{error}</p>}
    </div>
  );
}
