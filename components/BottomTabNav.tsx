"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";

const ACTIVE_COLOR = "#FF6B57";
const INACTIVE_COLOR = "#6B7280";

type IconProps = { active: boolean };

function iconProps(active: boolean): SVGProps<SVGSVGElement> {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: active ? ACTIVE_COLOR : INACTIVE_COLOR,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
}

function HomeIcon({ active }: IconProps) {
  return (
    <svg {...iconProps(active)}>
      <path d="M3.5 11.2 12 4l8.5 7.2" />
      <path d="M5.5 9.8V19a1 1 0 0 0 1 1H9.5v-5.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V20h3a1 1 0 0 0 1-1V9.8" />
    </svg>
  );
}

function UserIcon({ active }: IconProps) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="8.2" r="3.2" />
      <path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" />
    </svg>
  );
}

function SettingsIcon({ active }: IconProps) {
  return (
    <svg {...iconProps(active)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.7 6.3l-1.5 1.5M7.8 16.2l-1.5 1.5M17.7 17.7l-1.5-1.5M7.8 7.8 6.3 6.3" />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "홈", Icon: HomeIcon },
  { href: "/my", label: "내 정보", Icon: UserIcon },
  { href: "/settings", label: "설정", Icon: SettingsIcon },
] as const;

// 회원가입/로그인/글쓰기 등은 하단 탭 없이 단독으로 노출됨 (design.md Signup/Login/Feed-Write 프레임 참고)
const HIDDEN_ROUTES = ["/signup", "/login", "/posts", "/my/edit"];

export default function BottomTabNav() {
  const pathname = usePathname();

  if (HIDDEN_ROUTES.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-[82px] w-full max-w-md items-start justify-around border-t border-[#EBEBEB] bg-white pt-2">
      {TABS.map(({ href, label, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-4 py-1"
            aria-current={active ? "page" : undefined}
          >
            <Icon active={active} />
            <span
              className="text-xs"
              style={{ color: active ? ACTIVE_COLOR : INACTIVE_COLOR }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
