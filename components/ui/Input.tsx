import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  id,
  className,
  ...props
}: InputProps) {
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
      <input
        id={id}
        className={`text-ink-900 h-11 w-full rounded-[22px] bg-[#FAF6F2] px-4 text-sm outline-none placeholder:text-[#B3A99C] focus:ring-2 focus:ring-brand-600 ${
          error ? "ring-2 ring-[#FF5F5F]" : ""
        } ${className ?? ""}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#FF5F5F]">{error}</p>}
    </div>
  );
}
