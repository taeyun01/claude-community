import Link from "next/link";

export default function HomeButton() {
  return (
    <Link
      href="/"
      aria-label="홈으로 가기"
      className="flex h-8 w-8 items-center justify-center"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-ink-900)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 11.2 12 4l8.5 7.2" />
        <path d="M5.5 9.8V19a1 1 0 0 0 1 1H9.5v-5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V20h3a1 1 0 0 0 1-1V9.8" />
      </svg>
    </Link>
  );
}
