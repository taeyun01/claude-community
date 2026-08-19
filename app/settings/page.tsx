import Header from "@/components/nav/Header";
import LogoutButton from "@/components/settings/LogoutButton";

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="설정" showBack={false} />
      <div className="divide-y divide-[#EBEBEB] border-b border-[#EBEBEB]">
        <LogoutButton />
      </div>
    </div>
  );
}
