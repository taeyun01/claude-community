import type { ReactNode } from "react";

export default function FixedBottomCTA({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md bg-white px-4 pb-6 pt-3">
      {children}
    </div>
  );
}
