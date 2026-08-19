import Header from "@/components/nav/Header";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header title="회원가입" showBack={false} />
      <SignupForm />
    </div>
  );
}
