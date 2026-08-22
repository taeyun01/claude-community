-- 본인 투표 취소(재클릭 시 취소) 허용
create policy "poll_votes_delete_own" on public.poll_votes
  for delete to authenticated
  using (auth.uid() = user_id);
