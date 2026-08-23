-- 글 수정 화면에서 투표(질문/선택지)도 함께 수정/삭제할 수 있도록,
-- 글 작성자 본인에 한해 update/delete를 허용 (insert 정책과 동일한 소유권 패턴)

create policy "polls_update_own_post" on public.polls
  for update to authenticated
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.user_id = auth.uid()
    )
  );

create policy "polls_delete_own_post" on public.polls
  for delete to authenticated
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_id and posts.user_id = auth.uid()
    )
  );

create policy "poll_options_update_own_post" on public.poll_options
  for update to authenticated
  using (
    exists (
      select 1 from public.polls
      join public.posts on posts.id = polls.post_id
      where polls.id = poll_id and posts.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.polls
      join public.posts on posts.id = polls.post_id
      where polls.id = poll_id and posts.user_id = auth.uid()
    )
  );

create policy "poll_options_delete_own_post" on public.poll_options
  for delete to authenticated
  using (
    exists (
      select 1 from public.polls
      join public.posts on posts.id = polls.post_id
      where polls.id = poll_id and posts.user_id = auth.uid()
    )
  );
