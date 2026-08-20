import Link from "next/link";

export default function WriteButton() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24.5 z-20 mx-auto flex h-16 w-full max-w-md justify-end px-4">
      <Link
        href="/posts/new"
        aria-label="글쓰기"
        className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 shadow-lg"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </Link>
    </div>
  );
}
