import Header from "@/components/nav/Header";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import { getCurrentUser } from "@/lib/dal";

export default async function MyPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex h-full flex-col">
        <Header title="내 정보" showBack={false} />
        <RequireLoginDialog />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <h1 className="text-lg font-semibold text-gray-900">내 정보</h1>
    </div>
  );
}
