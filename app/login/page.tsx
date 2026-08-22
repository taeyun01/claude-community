import Header from "@/components/nav/Header";
import HomeButton from "@/components/nav/HomeButton";
import LoginForm from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams;

  return (
    <div className="flex min-h-full flex-col">
      <Header title="로그인" showBack={false} rightSlot={<HomeButton />} />
      <LoginForm
        redirectTo={Array.isArray(redirectTo) ? redirectTo[0] : redirectTo}
      />
    </div>
  );
}
