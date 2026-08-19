import Header from "@/components/nav/Header";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header title="로그인" showBack={false} />
      <LoginForm />
    </div>
  );
}
