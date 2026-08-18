# Supabase 연결 (1단계: 기본 연결)

## Context

Supabase 프로젝트는 이미 생성되어 있고 Project URL / anon key를 사용할 수 있는 상태. `docs/plan.md`의 "1. 기반 설정"에 전체 Supabase 통합 계획(클라이언트 헬퍼, DB 마이그레이션, RLS, Storage, 인증 가드)이 정리되어 있지만, 이 문서는 그중 가장 먼저 필요한 부분 — 코드베이스에 Supabase SDK를 실제로 연결하고 정상 동작을 확인하는 첫 단계만 다룸. DB 스키마/RLS/인증 가드는 이후 별도 단계로 진행.

작업 시작 시점 상태: `package.json`에 Supabase 관련 의존성 없음, `.env*` 파일 없음, `supabase/` 디렉토리 없음 — 완전히 처음부터 시작.

## 작업 내용

1. **패키지 설치**: `@supabase/ssr`, `@supabase/supabase-js`
2. **환경변수 파일**
   - `.env.example` — placeholder 값, 커밋 대상 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - `.env.local` — 실제 값. `.gitignore`에 `.env*`가 이미 포함되어 있어 커밋되지 않음. 실제 URL/anon key로 반드시 교체 필요.
3. **Supabase 클라이언트 헬퍼** (App Router `@supabase/ssr` 패턴, `src/` 없이 루트 기준)
   - `lib/supabase/client.ts` — 브라우저(Client Component)용, `createBrowserClient(url, anonKey)`
   - `lib/supabase/server.ts` — 서버(Server Component/Action)용, `createServerClient(url, anonKey, { cookies })`, `next/headers`의 `cookies()` 사용
4. **연결 확인**
   - 임시로 서버 컴포넌트에서 `supabase.auth.getUser()` 호출 → 에러 없이 응답이 오면 연결 성공으로 간주 (테이블이 아직 없어도 Auth 엔드포인트만으로 확인 가능)

## 이번 단계에서 하지 않는 것 (다음 단계로 미룸)

- `profiles`/`posts`/`comments`/`likes` 테이블 마이그레이션 및 RLS 정책 (`supabase/migrations/`)
- `proxy.ts`(Next.js 16의 middleware 대체) 기반 로그인 가드
- Storage 버킷(`avatars`, `post-images`) 설정

## 검증

- `npm run dev` 실행 후 연결 확인 코드가 에러 없이 응답하는지 확인
- `git status`로 `.env.local`이 추적되지 않는지 확인
- `npm run lint`, `npx tsc --noEmit` 통과
