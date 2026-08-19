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
          className="mb-1.5 block text-xs font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`h-11 w-full rounded-[22px] bg-[#F6F6F6] px-4 text-sm text-gray-900 outline-none placeholder:text-[#B6B6B6] focus:ring-2 focus:ring-brand-600 ${
          error ? "ring-2 ring-[#FF5F5F]" : ""
        } ${className ?? ""}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-[#FF5F5F]">{error}</p>}
    </div>
  );
}
