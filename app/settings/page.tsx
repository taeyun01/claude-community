import Header from "@/components/nav/Header";
import LogoutButton from "@/components/settings/LogoutButton";
import ThemeToggle from "@/components/settings/ThemeToggle";
import RequireLoginDialog from "@/components/auth/RequireLoginDialog";
import { getCurrentUser } from "@/lib/dal";
import { getTheme } from "@/lib/getTheme";

export default async function SettingsPage() {
  const [user, theme] = await Promise.all([getCurrentUser(), getTheme()]);

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
      <div className="divide-line border-line divide-y border-b">
        <ThemeToggle initialTheme={theme} />
        <LogoutButton />
      </div>
    </div>
  );
}
