import type { ReactNode } from "react";

export default function FixedBottomCTA({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-md px-4 pt-3 pb-6">
      {children}
    </div>
  );
}
