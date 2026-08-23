-- 홈 피드에서 새 게시글 생성을 실시간으로 감지할 수 있도록
-- posts 테이블을 Supabase Realtime publication에 추가

alter publication supabase_realtime add table public.posts;
