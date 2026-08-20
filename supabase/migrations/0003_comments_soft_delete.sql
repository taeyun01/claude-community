-- 댓글 소프트 삭제: deleted_at 컬럼 + 본인 댓글 update 정책
-- (기존 comments_delete_own DELETE 정책은 유지하되, 앱에서는 soft delete만 사용)

alter table public.comments add column deleted_at timestamptz;

create policy "comments_update_own" on public.comments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
