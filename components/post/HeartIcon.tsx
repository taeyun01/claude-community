export default function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={filled ? "#FF6B57" : "none"}
      stroke={filled ? "#FF6B57" : "#6B7280"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-6.7-4.3-9.3-8.2C1 10.1 1.6 6.6 4.4 5.1c2.2-1.2 4.9-.5 6.3 1.5l1.3 1.8 1.3-1.8c1.4-2 4.1-2.7 6.3-1.5 2.8 1.5 3.4 5 1.7 7.7C18.7 16.7 12 21 12 21z" />
    </svg>
  );
}
