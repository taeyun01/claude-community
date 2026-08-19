-- avatars 버킷 (프로필 이미지) + storage 정책
-- see docs/plan.md 3장 Storage, docs/requirements.md 5.6

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- 조회는 누구나 가능 (public bucket)
create policy "avatars_select_all" on storage.objects
  for select using (bucket_id = 'avatars');

-- 업로드/수정/삭제는 로그인한 사용자가 본인 폴더(<uid>/...)에만 가능
create policy "avatars_insert_own_folder" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_update_own_folder" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_delete_own_folder" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
