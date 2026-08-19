import Header from "@/components/nav/Header";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const loginRequired = searchParams.message === "login-required";

  return (
    <div className="flex min-h-full flex-col">
      <Header title="로그인" />
      {loginRequired && (
        <p className="px-4 pt-4 text-sm text-[#FF5F5F]" aria-live="polite">
          로그인이 필요합니다.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
