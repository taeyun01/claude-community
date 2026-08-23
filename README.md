# Community

모바일 웹 기반 커뮤니티 서비스입니다. 글 작성/피드/댓글/좋아요/프로필 등 기본적인 커뮤니티 기능과 투표(질문 + 선택지) 게시글을 지원하며, 하단 탭 내비게이션(홈 / 내 정보 / 설정) 구조의 모바일 전용 UI로 구현되어 있습니다.

## 기술 스택

- **프레임워크**: [Next.js 16](https://nextjs.org) (App Router)
- **언어**: TypeScript, React 19
- **스타일링**: Tailwind CSS v4 (CSS-first `@theme`, `app/globals.css`)
- **백엔드**: [Supabase](https://supabase.com) (Auth, Postgres DB, Storage)
- **검증**: Zod
- **모니터링**: Sentry (`@sentry/nextjs`) — 에러 트래킹 및 소스맵 업로드
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 아래 값을 채워주세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Sentry 소스맵 업로드(빌드 시)를 사용하려면 `.env.sentry-build-plugin`에 `SENTRY_AUTH_TOKEN`을 추가로 설정합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다. (포트가 사용 중이면 3001부터 순차 사용)

## 주요 스크립트

| 명령어             | 설명                       |
| ------------------ | -------------------------- |
| `npm run dev`      | 개발 서버 실행 (Turbopack) |
| `npm run build`    | 프로덕션 빌드              |
| `npm run start`    | 프로덕션 빌드 서빙         |
| `npm run lint`     | ESLint 검사                |
| `npx tsc --noEmit` | 타입 체크                  |

별도로 구성된 테스트 프레임워크는 없습니다.

## 프로젝트 구조

```
app/                    # App Router 라우트 (src 디렉터리 없음)
  page.tsx              # 홈 피드
  login/, signup/       # 인증
  posts/[id]/           # 글 상세, 수정
  posts/new/            # 글 작성
  my/, my/edit/         # 내 정보 조회/수정
  profile/[id]/         # 다른 유저 프로필
  settings/             # 설정 (로그아웃 등)
  api/                  # Route Handlers
components/
  auth/, post/, comment/, profile/, settings/, nav/, ui/
lib/
  supabase/             # 브라우저/서버 Supabase 클라이언트, DB 타입
  actions/              # Server Actions (posts, comments, likes, polls, profile, auth, theme)
  validations/          # Zod 스키마
docs/                   # 요구사항/설계/구현 계획 문서 (아래 참고)
```

경로 별칭 `@/*`는 리포지토리 루트를 가리킵니다 (`tsconfig.json`).

## 주요 기능

- **인증**: 이메일/비밀번호 회원가입·로그인·로그아웃 (Supabase Auth)
- **게시글**: 작성/수정/삭제, 피드 조회, 실시간 새 글 알림 배너
- **투표 게시글**: 질문 + 선택지 형태의 글 작성 및 수정
- **댓글**: 작성/조회/삭제
- **좋아요**: 게시글 좋아요/취소
- **프로필**: 내 프로필 조회·수정(닉네임, 프로필 이미지), 다른 유저 프로필 보기
- **설정**: 다크모드 테마 토글, 로그아웃

## 문서

기능/화면/DB 스키마 등 설계 의도가 담긴 문서는 `docs/` 디렉터리를 참고하세요.

- `docs/requirements.md` — 기능 요구사항, 화면 목록, 유저 플로우, DB 스키마
- `docs/design.md` — Figma 디자인 분석 (색상, 타이포그래피, 컴포넌트 매핑)
- `docs/plan.md` — 전체 구현 계획 (폴더 구조, 라우트 테이블, 구현 순서)
- `docs/supabase-setup.md` — Supabase 연동 세부 계획

이 저장소는 **Next.js 16**을 사용하며 이전 버전과 API/컨벤션 차이가 있습니다 (`middleware.ts` → `proxy.ts` 등). 자세한 내용은 `AGENTS.md`를 참고하세요.
