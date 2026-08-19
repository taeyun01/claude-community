import type { ButtonHTMLAttributes } from "react";

type ListItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export default function ListItem({
  label,
  className,
  ...props
}: ListItemProps) {
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between px-4 text-left text-sm text-gray-900 ${className ?? ""}`}
      {...props}
    >
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#B6B6B6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}
