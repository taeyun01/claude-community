"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/dal";
import { profileSchema } from "@/lib/validations/profile";

export type ProfileState = {
  errors?: {
    nickname?: string[];
    avatar?: string[];
  };
  message?: string;
};

const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const validated = profileSchema.safeParse({
    nickname: formData.get("nickname"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { nickname } = validated.data;
  const supabase = await createClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .neq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return { errors: { nickname: ["이미 사용 중인 닉네임입니다."] } };
  }

  const avatar = formData.get("avatar");
  let avatarUrl: string | undefined;

  if (avatar instanceof File && avatar.size > 0) {
    if (avatar.size > MAX_AVATAR_SIZE) {
      return { errors: { avatar: ["이미지 용량은 5MB 이하여야 합니다."] } };
    }

    const path = `${user.id}/avatar`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, {
        upsert: true,
        contentType: avatar.type,
      });

    if (uploadError) {
      return {
        message: "이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);
    avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { errors: { nickname: ["이미 사용 중인 닉네임입니다."] } };
    }
    return {
      message: "프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }

  revalidatePath("/my");
  redirect("/my");
}
