import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 경로별 접근 제어는 각 페이지(Server Component)에서 getCurrentUser()로 처리한다.
// 여기서는 요청마다 Supabase 세션 쿠키를 갱신하는 역할만 한다.
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
  await supabase.auth.getClaims();

  return supabaseResponse;
}
