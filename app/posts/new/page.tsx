import Header from "@/components/nav/Header";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import PostForm from "@/components/post/PostForm";
import { getCurrentUser } from "@/lib/dal";

export default async function NewPostPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex h-full flex-col">
        <Header title="글쓰기" />
        <RequireLoginDialog />
      </div>
    );
  }

  return <PostForm />;
}
