import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  experimental: {
    // Server Action 기본 요청 본문 제한(1MB)이 프로필 아바타 업로드 한도(5MB)보다
    // 작아 모바일 카메라 사진처럼 큰 파일이 서버 에러로 거부되는 문제를 방지.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    // 사용자가 업로드한 SVG(아바타)를 렌더링하기 위해 허용. contentDispositionType/CSP로
    // 스크립트 실행을 막아 SVG 내 악성 스크립트로부터 방어.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
