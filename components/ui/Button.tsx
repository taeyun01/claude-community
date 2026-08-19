import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`font-poppins h-11 w-full rounded-[22px] text-sm font-semibold text-white transition-colors ${
        disabled ? "bg-brand-300" : "bg-brand-600 active:bg-brand-600/90"
      } ${className ?? ""}`}
      {...props}
    />
  );
}
