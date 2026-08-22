-- 계정별 다크모드 설정을 서버에 저장 (profiles_update_own RLS로 이미 본인만 수정 가능)
alter table public.profiles
  add column theme text not null default 'light' check (theme in ('light', 'dark'));
