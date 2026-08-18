# 디자인 분석 문서 (Figma)

- Figma 파일: [Community](https://www.figma.com/design/GR7WBfnAP7K4PoVuw7hq9f/Community?node-id=0-1)
- 대상: 모바일 웹 (프레임 사이즈 390 x 844, iOS 세이프에어리어 기준 상태바 44px)
- 분석일: 2026-08-18
- 참고: `docs/requirements.md`의 화면목록(S-01~S-10)과 대조하여 정리함

파일 내 "Page 1"은 크게 두 영역으로 구성됨
1. **스크린 섹션** — 실제 화면 프레임 (Home, Login, Signup, Feed/Detail 등)
2. **컴포넌트/색상/이미지 섹션** — Button, Navigation, Input, Setting, Color, Asset 등 재사용 컴포넌트 라이브러리

---

## 1. 화면 구조 (Screen Structure)

| Figma 프레임 | 대응 요구사항 화면 | 구성 |
|---|---|---|
| `AuthHome` | 로그인 진입(요구사항 밖 추가 화면) | 로고, 마스코트 일러스트, "로그인하기" CTA, "이메일로 가입하기" 텍스트 링크 |
| `Login` | S-02 로그인 화면 | Header(뒤로가기+타이틀), 이메일/비밀번호 Input(Filled) 2개, 하단 고정 CTA(FixedBottomCTA) |
| `Signup` | S-01 회원가입 화면 | Header, 이메일/비밀번호/비밀번호 확인 Input(Filled) 3개, 하단 고정 CTA |
| `Home` | S-03 홈(피드) 화면 | 상단 검색바(SearchInput), FeedItem 리스트(무한 스크롤 가정), 하단 BottomTab(3탭), 우하단 WriteButton(FAB) |
| `Feed/Search` | 홈 내 검색 진입 상태 | 뒤로가기 + SearchInput(포커스), 키보드 오버레이, FeedItem 리스트 |
| `Feed/Write` | S-04 글 작성 화면 (S-06 수정 화면도 동일 폼 재사용) | Header(뒤로가기 + 타이틀 + "저장" 액션), 제목 Input(Filled), 본문 Textarea(Filled/MultiLine), 첨부 이미지 썸네일 2장 |
| `Feed/Detail` | S-05 글 상세 화면 | Header(뒤로가기), 게시글 원문(FeedItem), 좋아요/댓글/조회 Action bar, 댓글 리스트(Comment), 하단 댓글 입력창 |
| `My` / `Profile/[id]` | S-07 내 프로필, S-09 다른 유저 프로필 | 커버 이미지, 원형 프로필 사진, 닉네임/소개, 탭(게시물 등), 작성 글 FeedItem 리스트, 하단 BottomTab. `Profile/[id]`는 우상단 "더보기(⋯)"만 노출되고 수정 버튼 없음(읽기 전용) |
| `Profile/Update` | S-08 프로필 수정 화면 | Header, 프로필 사진 + "사진 변경"(Outlined 버튼), 닉네임 Input(Filled/Label), 소개 Input, 하단 고정 저장 CTA |
| `Setting` | S-10 설정 화면 | Header(타이틀만), 리스트 영역(ListItem: "로그아웃" 등), 로그아웃 시 ActionSheet(확인 다이얼로그), 하단 BottomTab |
| `SplashScreen` | 공통(앱 진입) | 상태바 + 중앙 로고만 배치된 스플래시 |

### 공통 내비게이션 구조
- **하단 탭(BottomTab)** 3개: 홈 / 내 프로필 / 설정 — 요구사항 FR-601과 일치. 활성 탭은 브랜드 오렌지(#FF6B57) 아이콘+라벨, 비활성은 블랙/그레이 텍스트.
- **상단 Header**: 뒤로가기(chevron-left) + 중앙 타이틀 기본형. 우측에 텍스트 액션(예: "저장")이 붙는 변형(TwoButton, CustomHeader 등 4종)이 존재.
- **FixedBottomCTA**: 로그인/회원가입/프로필 수정처럼 폼 제출이 있는 화면 하단에 고정되는 풀블리드 버튼(390x90 영역, 버튼 자체는 좌우 16px 마진).
- **WriteButton(FAB)**: 홈 화면 우하단(64x64, 원형, 오렌지) — 글쓰기 진입점.

---

## 2. 주요 컴포넌트 (Component Library)

Figma의 "컴포넌트" 섹션은 아래 그룹으로 정리되어 있음.

### Button
- **Filled** (Small/Medium/Large) — 브랜드 오렌지 배경 + 화이트 텍스트. Disabled 상태 별도 존재(톤 낮춘 회색/연한 오렌지).
- **Outlined** (Small/Medium) — 오렌지 보더 + 화이트 배경, 보조 액션(예: "사진 변경")에 사용.
- **Standard** (Small/Medium) — 배경 없는 텍스트 버튼, 헤더의 "저장" 등 텍스트형 액션.
- **Icon 버튼 세트**: Like / Comment / Share / Cancel / Reply / Camera / Vote / Setting / User 등 24x24 아이콘.
- **WriteButton / FixedBottomCTA**: 위 화면 구조 참고.

### Navigation
- Header 4종(Default, TwoButton, CustomHeader, CustomHeader/Black)
- Tabs 3종(Two/Three/Four 탭 segmented 형태 — 프로필 상세 내 "게시물" 등에 사용)
- BottomTab, StatusBar, SafeArea/Bottom

### Input
- **Filled** — 배경 `Gray/100`(#F6F6F6) 채움형 인풋. 기본(44h) / MultiLine(textarea, 85h) / Label 붙은 형태(68h) / Error 상태(92h, 빨간 보더+헬프텍스트) 지원.
- **Outlined / Standard** — 라인형 인풋(보더만 있는 형태), 아이콘 포함 변형 존재.
- **Search** — 306x44, radius 22(완전한 pill), 배경 `Gray/100`, placeholder 텍스트 `#B6B6B6`, 우측 돋보기 아이콘.

### Feed / 게시글
- **FeedItem**: 프로필(아바타+닉네임+시간), 본문 텍스트(2~3줄 미리보기 + ...), 첨부 이미지(단일/복수 - 최대 2장 썸네일, radius 8), 하단 FeedAction(좋아요/댓글/조회수, 각 아이콘+숫자 pair).
- **Comment**: CommentHeader(작성자+시간), CommentInput(입력창+등록 버튼), 댓글 리스트 아이템(Default).
- **Profile 서브컴포넌트**: Avatar(Feed용/Comment용), FeedItemProfile, CommentItemProfile, Follow(True/False 상태), ProfileDetail(프로필 전체 헤더).

### Setting
- **ListItem** — 좌측 라벨 + 우측(화살표 등), 390x40.
- **ActionSheet** — 로그아웃 등 확인용 바텀시트 다이얼로그(365x134).

### 공용 자산(Asset)
- `logo`(112x112), `default-avatar`(229x229, 마스코트 곰 캐릭터) — 프로필 이미지 미설정 시 기본값으로 추정.

---

## 3. 색상 톤 (Color)

디자인 시스템에 별도 컬러 스와치 섹션이 정의되어 있고, 프레임 전반에서 실제 사용되는 값은 아래와 동일함.

### Brand / Orange (Primary)
| 토큰 | HEX | 용도 |
|---|---|---|
| Orange 100 | `#FFF7F1` | 연한 배경 톤 |
| Orange 200 | `#FFDEC6` | 연한 배경/보더 |
| Orange 300 | `#FFB884` | 보조 강조 |
| Orange 600 | `#FF6B57` | **Primary 브랜드 컬러** — CTA 버튼, FAB, 활성 탭, 좋아요 활성 상태, 링크 강조 텍스트 |

### Gray / Neutral
| 토큰 | HEX | 용도 |
|---|---|---|
| Gray 100 | `#F6F6F6` | Input/Search 배경, 카드 placeholder |
| Gray 200 | `#E2E8F0` | 디바이더/서브 배경 |
| Gray 300 | `#D1D5DB` | 보더, 비활성 아이콘 |
| Gray 500 | `#6B7280` | 보조 텍스트(예: "3시간 전") |
| Gray 600 | `#4B5563` | 서브 텍스트/아이콘 |
| Gray 700 | `#374151` | 진한 보조 텍스트 |
| Slate 900 | `#0F172A` | 다크 텍스트 참고값 |

### Red (Error/Alert)
| 토큰 | HEX | 용도 |
|---|---|---|
| Red 100 | `#FFDFDF` | 에러 인풋 배경/보더 톤 |
| Red 500 | `#FF5F5F` | 에러 텍스트/경고 강조 |

### 기본
- 배경: 화이트 `#FFFFFF`
- 본문 텍스트: 블랙 계열 `#000000` / `#161616`
- 디바이더 라인: `#EBEBEB`
- 탭바 상단 보더: `rgba(25,27,35,0.05)` (아주 옅은 그림자성 라인)
- 플레이스홀더 텍스트: `#B6B6B6`, 보조 텍스트: `#8A8A8A`

전체적으로 **화이트 배경 + 오렌지 포인트 컬러 + 그레이스케일 텍스트/보더**의 미니멀하고 따뜻한 톤. 채도 높은 컬러는 브랜드 컬러(오렌지)와 에러(레드)에만 제한적으로 사용하고, 나머지는 그레이스케일로 정보 위계를 표현.

---

## 4. 타이포그래피

| 용도 | 폰트 | 스타일/크기 | 비고 |
|---|---|---|---|
| 상태바 시간, 탭 라벨, 본문(피드 본문), 리스트 라벨 | **IBM Plex Sans** | Regular/Medium/SemiBold, 12~15px | UI 텍스트 전반의 기본 폰트 |
| 닉네임, 헤더 타이틀, 버튼 라벨, 색상 스와치 라벨 | **Poppins** | Regular/SemiBold, 14~20px | 숫자(좋아요/댓글 수), 강조 텍스트에 자주 사용 |
| 본문 기본 스타일 | body/Small/regular | 14px, line-height 1.6 | 피드 본문 텍스트 |
| 캡션 | body small | 12px, line-height 100% | 탭 라벨 등 |

두 폰트가 용도별로 혼용되어 있음(피드 본문/캡션류는 IBM Plex Sans, 닉네임·버튼·숫자류는 Poppins). 실제 구현 시 두 폰트 중 하나로 통일하거나 fallback 처리 필요.

---

## 5. 간격 / 레이아웃 톤 (Spacing & Layout)

- **화면 기준 폭**: 390px (모바일 웹 반응형 기준 프레임)
- **좌우 컨텐츠 마진**: 16px 고정 (`Input`, `FixedBottomCTA`, `FeedItem` 텍스트 등 대부분 좌우 16px 인셋)
- **상태바 높이**: 44px, **Header 높이**: 56~59px, **BottomTab 높이**: 82px
- **피드 아이템 간 간격**: 카드 사이 32px gap (`Home-feed-timeline` flex gap)
- **인풋 필드 높이**: 기본 44px / Label 포함 68px / MultiLine(textarea) 85px / Error 92px
- **버튼 높이**: Small 28px, Medium 38~44px, Large(FixedBottomCTA 내부) 44px
- **FAB(WriteButton)**: 64x64, 화면 우측 하단 기준 우측 16px / 하단 탭 위 여백 확보
- **라운드(Radius)**:
  - Pill(완전 라운드): Search/Input, Filled 버튼 전반 (radius = height/2, 예: 44px 높이 → 22px)
  - 카드/이미지 썸네일: 8px
  - 아바타: 원형(114.5px = 자체 지름 기준)
- **아이콘 사이즈**: 기본 24x24 그리드
- **디바이더**: 1px 솔리드 라인(`#EBEBEB`), 섹션 구분에 사용(FeedAction 상단, Header 하단 등)

전체 톤: 16px 그리드 기반의 여유 있는 마진, pill 형태의 입력/버튼, 8px 라운드의 카드형 이미지 — 부드럽고 캐주얼한 커뮤니티 앱 톤앤매너.

---

## 6. 참고 스크린샷

`Home`, `Login`, `AuthHome`, `Feed/Detail`, `Feed/Write`, `Profile/[id]`, `Setting` 프레임을 육안 검수함. 마스코트(곰) 일러스트가 로고/기본 아바타로 반복 사용되어 브랜드 아이덴티티를 형성하고 있음. `Setting` 화면은 현재 헤더/탭만 배치되어 있고 리스트 내용(로그아웃 등)은 별도 컴포넌트 섹션에만 정의되어 있어 실제 화면에 조립이 필요함.
