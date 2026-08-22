-- 투표(poll) 기능: polls(게시글에 딸린 질문) / poll_options(선택지) / poll_votes(투표 기록)
-- 결과 조회(select)는 누구나 가능, 투표(insert)는 로그인 사용자만, 한 사람이 한 poll당 한 표만

create table public.polls (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  question text not null,
  created_at timestamptz not null default now()
);

create index polls_post_id_idx on public.polls (post_id);

create table public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls (id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now(),
  -- poll_votes에서 (option_id, poll_id) 복합 FK로 참조하기 위한 유니크 제약
  unique (id, poll_id)
);

create index poll_options_poll_id_idx on public.poll_options (poll_id);

create table public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls (id) on delete cascade,
  option_id uuid not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  -- 한 사람이 같은 투표에 두 번 투표하지 못하도록 제약
  unique (poll_id, user_id),
  -- option_id가 반드시 poll_id에 속한 선택지여야 함을 보장 (다른 투표의 선택지로 투표하는 것 방지)
  foreign key (option_id, poll_id) references public.poll_options (id, poll_id) on delete cascade
);

create index poll_votes_poll_id_idx on public.poll_votes (poll_id);
create index poll_votes_option_id_idx on public.poll_votes (option_id);
create index poll_votes_user_id_idx on public.poll_votes (user_id);

-- RLS
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;

create policy "polls_select_all" on public.polls
  for select using (true);

-- 글 작성자만 자신의 글에 투표를 붙일 수 있음 (posts_insert_own과 동일한 소유권 패턴)
create policy "polls_insert_own_post" on public.polls
  for insert to authenticated
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.user_id = auth.uid()
    )
  );

create policy "poll_options_select_all" on public.poll_options
  for select using (true);

create policy "poll_options_insert_own_post" on public.poll_options
  for insert to authenticated
  with check (
    exists (
      select 1 from public.polls
      join public.posts on posts.id = polls.post_id
      where polls.id = poll_id and posts.user_id = auth.uid()
    )
  );

create policy "poll_votes_select_all" on public.poll_votes
  for select using (true);

-- 로그인한 사용자만 본인 명의로 투표 가능
create policy "poll_votes_insert_own" on public.poll_votes
  for insert to authenticated
  with check (auth.uid() = user_id);
