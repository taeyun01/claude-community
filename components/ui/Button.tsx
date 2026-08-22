import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "filled" | "outlined";
};

export default function Button({
  className,
  disabled,
  variant = "filled",
  ...props
}: ButtonProps) {
  const variantClass =
    variant === "outlined"
      ? "border border-brand-600 bg-surface text-brand-600"
      : disabled
        ? "bg-brand-300 text-white"
        : "bg-brand-600 text-white active:bg-brand-600/90";

  return (
    <button
      disabled={disabled}
      className={`font-poppins h-11 w-full rounded-[22px] text-sm font-semibold transition-colors disabled:opacity-60 ${variantClass} ${className ?? ""}`}
      {...props}
    />
  );
}
