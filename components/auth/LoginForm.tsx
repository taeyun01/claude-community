"use client";

import { useActionState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FixedBottomCTA from "@/components/nav/FixedBottomCTA";
import { signIn, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 px-4 py-6">
        <Input
          id="email"
          name="email"
          type="email"
          label="이메일"
          placeholder="이메일을 입력해주세요"
          error={state.errors?.email?.[0]}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          error={state.errors?.password?.[0]}
          autoComplete="current-password"
        />
        {state.message && (
          <p className="text-sm text-[#FF5F5F]" aria-live="polite">
            {state.message}
          </p>
        )}
        <p className="text-center text-sm text-gray-700">
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-brand-600">
            회원가입
          </Link>
        </p>
      </div>
      <FixedBottomCTA>
        <Button type="submit" disabled={pending}>
          {pending ? "로그인 중..." : "로그인"}
        </Button>
      </FixedBottomCTA>
    </form>
  );
}
