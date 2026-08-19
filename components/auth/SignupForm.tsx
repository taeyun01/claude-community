"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FixedBottomCTA from "@/components/nav/FixedBottomCTA";
import { signUp, type SignupState } from "@/lib/actions/auth";

const initialState: SignupState = {};

type FormValues = {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
};

const initialValues: FormValues = {
  email: "",
  password: "",
  passwordConfirm: "",
  nickname: "",
};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [values, setValues] = useState<FormValues>(initialValues);

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

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
          value={values.email}
          onChange={handleChange("email")}
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="비밀번호"
          placeholder="8자 이상 입력해주세요"
          error={state.errors?.password?.[0]}
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange("password")}
        />
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요"
          error={state.errors?.passwordConfirm?.[0]}
          autoComplete="new-password"
          value={values.passwordConfirm}
          onChange={handleChange("passwordConfirm")}
        />
        <Input
          id="nickname"
          name="nickname"
          type="text"
          label="닉네임"
          placeholder="2~20자로 입력해주세요"
          error={state.errors?.nickname?.[0]}
          autoComplete="nickname"
          value={values.nickname}
          onChange={handleChange("nickname")}
        />
        {state.message && (
          <p className="text-sm text-gray-700" aria-live="polite">
            {state.message}
          </p>
        )}
        <p className="text-center text-sm text-gray-700">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-brand-600">
            로그인
          </Link>
        </p>
      </div>
      <FixedBottomCTA>
        <Button type="submit" disabled={pending}>
          {pending ? "가입 중..." : "가입하기"}
        </Button>
      </FixedBottomCTA>
    </form>
  );
}
