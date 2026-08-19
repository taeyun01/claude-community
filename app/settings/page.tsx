import Header from "@/components/nav/Header";
import LogoutButton from "@/components/settings/LogoutButton";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import { getCurrentUser } from "@/lib/dal";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="flex h-full flex-col">
        <Header title="설정" showBack={false} />
        <RequireLoginDialog />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="설정" showBack={false} />
      <div className="divide-y divide-[#EBEBEB] border-b border-[#EBEBEB]">
        <LogoutButton />
      </div>
    </div>
  );
}
