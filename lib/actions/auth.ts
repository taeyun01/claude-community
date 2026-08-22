"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signupSchema, loginSchema } from "@/lib/validations/auth";

export type SignupState = {
  errors?: {
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
    nickname?: string[];
  };
  message?: string;
};

export async function signUp(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const validated = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    nickname: formData.get("nickname"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password, nickname } = validated.data;
  const supabase = await createClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .maybeSingle();

  if (existingProfile) {
    return { errors: { nickname: ["이미 사용 중인 닉네임입니다."] } };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nickname } },
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return { errors: { email: ["이미 가입된 이메일입니다."] } };
    }
    if (error.code === "weak_password") {
      return { errors: { password: ["비밀번호가 너무 취약합니다."] } };
    }
    // profiles.nickname is created via the on_auth_user_created trigger, so a race-condition
    // unique violation surfaces here as a generic AuthError, not a Postgrest 23505 error code.
    if (error.message.toLowerCase().includes("nickname")) {
      return { errors: { nickname: ["이미 사용 중인 닉네임입니다."] } };
    }
    return { message: "가입 중 오류가 발생했습니다. 다시 시도해주세요." };
  }

  if (!data.session) {
    return {
      message: "가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.",
    };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/settings");
  }

  redirect("/");
}

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

function getSafeRedirect(redirectTo: string | undefined): string {
  if (
    redirectTo &&
    redirectTo.startsWith("/") &&
    !redirectTo.startsWith("//")
  ) {
    return redirectTo;
  }
  return "/";
}

export async function signIn(
  redirectTo: string | undefined,
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return { message: "이메일 인증 후 로그인해주세요." };
    }
    return { message: "이메일 또는 비밀번호가 일치하지 않습니다." };
  }

  redirect(getSafeRedirect(redirectTo));
}
