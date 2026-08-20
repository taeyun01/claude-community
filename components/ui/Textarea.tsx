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
          className="mb-1.5 block text-xs font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`min-h-[85px] w-full resize-none rounded-2xl bg-[#F6F6F6] px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-[#B6B6B6] focus:ring-2 focus:ring-brand-600 ${
          error ? "ring-2 ring-[#FF5F5F]" : ""
        } ${className ?? ""}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#FF5F5F]">{error}</p>}
    </div>
  );
}
