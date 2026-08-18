# 커뮤니티 서비스 개발 계획 (Next.js + Supabase)

## Context

`docs/requirements.md`(기능 요구사항, 화면목록 S-01~S-10, DB 스키마 개요)와 `docs/design.md`(Figma 디자인 분석: 화면 구조, 컴포넌트, 색상/간격 톤)는 이미 작성되어 있음. 현재 코드베이스는 `create-next-app`으로 갓 생성된 상태(Next.js 16.3.1 / React 19.2.8, App Router, Tailwind v4 CSS-first 설정, `@supabase/ssr`·`@supabase/supabase-js`·`zod`는 설치만 되어 있고 미사용, `src/`에는 기본 `layout.tsx`/`page.tsx`만 존재, `supabase/migrations/`는 비어 있음, 실제 Supabase 프로젝트 연결 전(`.env.local`은 placeholder))이며 아직 구현 코드는 전혀 없음.

이 계획은 두 문서의 요구사항·디자인을 바탕으로, 실제 구현에 들어가기 전 폴더 구조·라우트·DB·구현 순서·주의점을 확정하기 위한 것.

**스택 확정 사항**: Next.js 16 App Router + `@supabase/ssr`(브라우저/서버 클라이언트 분리) + Tailwind v4(CSS `@theme`, JS config 없음) + Vercel 배포. Next.js 16에서는 `middleware.ts`가 폐지되고 `proxy.ts`로 대체되었으므로 이 계획도 `src/proxy.ts` 기준으로 작성함. 새 의존성은 최소화하고 기존 설치된 `@supabase/ssr`, `@supabase/supabase-js`, `zod`를 재사용함(무거운 UI 라이브러리 도입 안 함, 무한스크롤은 네이티브 `IntersectionObserver` 사용).

---

## 1. 폴더 구조

```
src/
  proxy.ts                        # Next 16의 middleware.ts 대체 — 세션 새로고침 + 낙관적 리다이렉트

  lib/
    supabase/
      client.ts                   # 브라우저용 Supabase 클라이언트 (Client Component에서 사용)
      server.ts                   # 서버용 Supabase 클라이언트 (Server Component/Action/Route Handler)
      proxy.ts                    # proxy.ts 전용 세션 갱신 헬퍼 (updateSession)
      database.types.ts           # profiles/posts/comments/likes 타입 (추후 supabase gen types로 재생성 가능)
    dal.ts                        # getCurrentUser(), requireUser() — 인증 데이터 접근 계층
    validations/
      auth.ts                     # signupSchema, loginSchema, nicknameSchema (zod)
      post.ts                     # postSchema
      comment.ts                  # commentSchema
    actions/
      auth.ts                     # signUp, signIn, signOut Server Actions
      posts.ts                    # createPost, updatePost, deletePost, toggleLike
      comments.ts                 # createComment, deleteComment
      profile.ts                  # updateProfile, checkNicknameAvailable

  components/
    ui/                           # Button, Input, SearchInput, Avatar, IconButton, ActionSheet, ListItem
    nav/                          # BottomTabNav, Header, FixedBottomCTA, WriteButton
    post/                         # FeedItem, FeedList, PostForm, LikeButton
    comment/                      # CommentList, CommentSection, CommentInput
    profile/                      # ProfileDetail, ProfileEditForm
    auth/                         # SignupForm, LoginForm

  app/
    layout.tsx                    # 폰트(IBM Plex Sans/Poppins), 모바일 폭 셸(max-w-[430px])
    globals.css                   # Tailwind v4 @theme 토큰 (design.md 색상/타이포/spacing 반영)
    page.tsx                      # S-03 홈 피드 (Server)
    signup/page.tsx                # S-01
    login/page.tsx                 # S-02
    posts/
      new/page.tsx                 # S-04
      [id]/page.tsx                 # S-05
      [id]/edit/page.tsx            # S-06
    profile/
      page.tsx                     # S-07 (내 프로필)
      edit/page.tsx                 # S-08
    users/[id]/page.tsx             # S-09 (다른 유저 프로필)
    settings/page.tsx               # S-10
    api/
      posts/route.ts                # GET — 피드 무한스크롤 페이지네이션

supabase/
  migrations/
    0001_init_schema.sql          # profiles/posts/comments/likes + RLS 정책 + 트리거
    0002_storage_buckets.sql      # avatars, post-images 버킷 + storage 정책
```

**설계 판단**
- 별도 라우트 그룹(`(tabs)` 등)으로 하단 탭 레이아웃을 강제하지 않음 — 헤더 변형(Default/TwoButton 등)이 화면마다 달라 레이아웃보다 컴포넌트 조립이 더 단순함. `Header`/`BottomTabNav`는 각 페이지에서 직접 사용.
- 모든 쓰기 작업(회원가입/로그인/로그아웃, 글 CRUD, 댓글 작성/삭제, 좋아요 토글, 프로필 수정, 닉네임 중복확인)은 `'use server'` Server Action으로 구현. 피드 페이지네이션만 반복 조회이므로 `GET /api/posts` Route Handler로 분리.

---

## 2. 페이지/라우트 목록

| 화면 | 경로 | 로그인 | 렌더링 | 주요 데이터 작업 |
|---|---|---|---|---|
| S-01 회원가입 | `/signup` | X | Server+Client Form | `checkNicknameAvailable`, `signUp`(Auth+profiles trigger) |
| S-02 로그인 | `/login` | X | Server+Client Form | `signIn` (`signInWithPassword`) |
| S-03 홈 피드 | `/` | X(조회) | Server(첫 페이지)+Client(무한스크롤) | `getFeedPosts`, `GET /api/posts?cursor=` |
| S-04 글 작성 | `/posts/new` | O | Server(가드)+Client Form | `createPost` (Storage 업로드 포함) |
| S-05 글 상세 | `/posts/[id]` | X(조회)/O(댓글·좋아요) | Server+Client(좋아요/댓글) | `getPostById`, `getComments`, `toggleLike`, `createComment`, `deleteComment` |
| S-06 글 수정 | `/posts/[id]/edit` | O(작성자) | Server(가드+소유권 체크) | `updatePost` (S-04 폼 재사용, 프리필) |
| S-07 내 프로필 | `/profile` | O | Server | `getCurrentUser`, `getPostsByUser` |
| S-08 프로필 수정 | `/profile/edit` | O | Server+Client Form | `checkNicknameAvailable`, `updateProfile` (아바타 교체) |
| S-09 다른 유저 프로필 | `/users/[id]` | X(조회) | Server | `getProfileById`, `getPostsByUser` (읽기 전용, 수정 버튼 없음) |
| S-10 설정 | `/settings` | O | Server+Client(로그아웃 버튼) | `signOut`, ActionSheet 확인 다이얼로그 |
| (보조) 피드 페이지네이션 | `GET /api/posts` | X | Route Handler | keyset 페이지네이션(`created_at`,`id` 커서) |

모든 보호 라우트(`/posts/new`, `/posts/[id]/edit`, `/profile`, `/profile/edit`, `/settings`)는 `proxy.ts`에서 1차 리다이렉트, 각 Server Component/Action에서 `requireUser()`로 2차 검증(방어 이중화).

---

## 3. DB 테이블 개요

`docs/requirements.md` 5장 스키마를 그대로 채택, PK/FK/유니크 제약 및 RLS 정책까지 마이그레이션 SQL로 구체화.

| 테이블 | 핵심 컬럼 | 제약/관계 |
|---|---|---|
| `profiles` | `id`(PK, FK→`auth.users.id`), `nickname`(unique), `avatar_url`, `created_at`, `updated_at` | `auth.users` 1:1. 회원가입 시 `auth.users` insert 트리거로 자동 생성(닉네임은 `signUp` 시 `options.data.nickname`로 전달) |
| `posts` | `id`(PK), `user_id`(FK→`profiles.id`), `title`, `content`, `image_url`, `created_at`, `updated_at` | `profiles` 1:N. 인덱스: `created_at desc`, `user_id` |
| `comments` | `id`(PK), `post_id`(FK→`posts.id`), `user_id`(FK→`profiles.id`), `content`, `created_at` | `posts` 1:N. 인덱스: `(post_id, created_at)` |
| `likes` | `id`(PK), `post_id`(FK→`posts.id`), `user_id`(FK→`profiles.id`), `created_at` | `unique(post_id, user_id)` — 중복 좋아요 방지. 인덱스: `post_id`, `user_id` |

**RLS 정책 요약** (모든 테이블 RLS 활성화)
- `profiles`: `select` 전체 허용 / `update`는 `auth.uid() = id`만 / `insert`는 트리거(`SECURITY DEFINER`)만 수행, 일반 insert 정책 없음
- `posts`, `comments`, `likes`: `select` 전체 허용(공개 읽기) / `insert`는 `auth.uid() = user_id` / `update`(posts만)·`delete`는 소유자만(`auth.uid() = user_id`)

**Storage**
- `avatars`, `post-images` 버킷(public read), 업로드 경로를 `<uid>/...`로 강제하고 `storage.objects` 정책에서 `auth.uid()::text = (path의 첫 세그먼트)`인 경우만 insert/update/delete 허용.

---

## 4. 구현 순서

1. **기반 설정** — Supabase 프로젝트 연결(`.env.local` 실제 값), `supabase/migrations/0001_init_schema.sql`·`0002_storage_buckets.sql` 작성 및 적용, `src/lib/supabase/{client,server,proxy,database.types}.ts`, `src/proxy.ts`, `src/lib/dal.ts` 구현. Tailwind v4 `@theme` 토큰(색상/폰트/spacing)을 `globals.css`에 반영하고 `layout.tsx` 폰트를 IBM Plex Sans/Poppins로 교체.
2. **인증 (회원가입/로그인/로그아웃)** — S-01, S-02 구현, `signUp`/`signIn`/`signOut` Server Action, 닉네임 중복확인, `proxy.ts` 보호 라우트 리다이렉트 동작 확인.
3. **피드 (읽기 전용)** — S-03 홈 피드, `FeedItem`/`FeedList` 컴포넌트, `/api/posts` 무한스크롤, S-05 글 상세(조회 부분), S-09 다른 유저 프로필, S-07 내 프로필(조회 부분) — 이 시점까지는 글 작성 없이 Supabase 테이블 에디터로 시드 데이터 사용 가능.
4. **글 작성/수정/삭제** — S-04, S-06, `PostForm` 컴포넌트(재사용), 이미지 업로드(`post-images` 버킷), 소유권 검증(UI 숨김 + 서버 재검증 + RLS).
5. **댓글 · 좋아요** — S-05의 댓글/좋아요 인터랙션, `toggleLike`(낙관적 업데이트, `useOptimistic`), `createComment`/`deleteComment`(낙관적 업데이트), 중복 좋아요·빈 댓글 방지 검증.
6. **프로필 관리 · 설정** — S-08 프로필 수정(닉네임 재확인, 아바타 교체), S-10 설정 화면 완성(ListItem, 로그아웃 ActionSheet), '내 정보' 탭 비로그인 가드.
7. **배포** — Vercel 프로젝트 연결, 프로덕션 환경변수 설정, `next.config.ts`에 Supabase Storage `images.remotePatterns` 추가, S-01~S-10 전체 수동 시나리오(요구사항 3장 사용자 흐름 1:1 대응) 점검 후 배포.

각 단계는 `npm run lint` / `tsc --noEmit` 통과 + 해당 단계에 대응하는 `requirements.md` 3장의 사용자 흐름을 수동으로 재현하는 방식으로 검증(테스트 프레임워크 미설치 상태).

---

## 5. 주의점

- **RLS가 최종 방어선, UI 숨김은 보조 수단** — "작성자 본인만 수정/삭제" 같은 권한은 버튼 노출 여부로만 막지 말고, Server Action 내부에서 `auth.uid() === user_id` 재검증 + DB의 RLS 정책까지 3중으로 확인. 다른 계정으로 직접 URL 접근/폼 제출 시도해서 실제 차단되는지 확인 필요.
- **인증 검증은 `getUser()`, `getSession()` 아님** — 권한 판단(로그인 여부 확인)에는 반드시 `supabase.auth.getUser()`(Auth 서버에 재검증)를 사용하고, 쿠키만 읽는 `getSession()`으로 인가 결정을 내리지 않는다.
- **`proxy.ts`(구 middleware)는 낙관적 체크만** — 매 요청/프리페치마다 실행되므로 DB 조회 없이 쿠키 기반 리다이렉트만 수행하고, 실제 권한 확인은 각 Server Component/Action의 `requireUser()`(DAL)에서 다시 수행.
- **닉네임 중복확인은 레이스 컨디션 있음** — 프론트에서 디바운스된 사전 확인을 제공하되, 최종적으로는 `profiles.nickname unique` 제약 위반(Postgres 에러 코드 `23505`)을 서버 액션에서 캐치해 사용자에게 알려야 함.
- **비로그인 접근 시 리다이렉트 대상 보존** — 글 작성/댓글/좋아요/프로필 수정 시도 시 `/login?redirectTo=<원래 경로>`로 보내고, 로그인 성공 후 원래 화면으로 복귀시켜야 요구사항 2.2의 플로우와 일치.
- **삭제 정책(cascade)** — 게시글 삭제 시 댓글/좋아요가 `ON DELETE CASCADE`로 함께 삭제되도록 FK 제약을 설정(요구사항 2.8, 소프트 삭제 대신 cascade 채택 — 별도 정책 필요 시 재논의).
- **Storage 업로드 경로 규칙** — `avatars`/`post-images` 모두 `<uid>/파일명` 형태로 업로드해야 storage RLS 정책이 통과함. 이 규칙이 깨지면 업로드 자체가 막힘.
- **Tailwind v4는 JS config 파일 없음** — 디자인 토큰은 반드시 `globals.css`의 `@theme` 블록에 추가해야 하며, `tailwind.config.ts` 신규 생성 금지.
- **`middleware.ts`가 아니라 `proxy.ts`** — Next.js 16에서 middleware는 폐지되었으므로 새 코드/문서 작성 시 `proxy.ts` 명칭·API(`export function proxy`)를 사용해야 함(과거 자료의 `middleware.ts` 예제와 다름).
- **이미지 도메인 허용** — Supabase Storage public URL을 `next/image`로 쓰려면 `next.config.ts`의 `images.remotePatterns`에 프로젝트 Storage 호스트를 추가해야 함(누락 시 이미지 렌더링 실패).
