import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 홈/내 정보/설정은 로그인해야만 접근 가능 (design.md 화면 구조 기준 3개 탭)
const PROTECTED_ROUTES = ["/", "/my", "/settings"];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) =>
    route === "/"
      ? pathname === "/"
      : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // createServerClient와 getClaims() 사이에는 다른 코드를 두지 않는다.
  // (Supabase 공식 가이드 — 세션이 예기치 않게 끊기는 문제를 막기 위함)
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("message", "login-required");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
