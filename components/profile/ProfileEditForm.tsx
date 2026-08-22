"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import Header from "@/components/nav/Header";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FixedBottomCTA from "@/components/nav/FixedBottomCTA";
import { updateProfile, type ProfileState } from "@/lib/actions/profile";

const initialState: ProfileState = {};

type ProfileEditFormProps = {
  initialNickname: string;
  initialAvatarUrl: string | null;
};

export default function ProfileEditForm({
  initialNickname,
  initialAvatarUrl,
}: ProfileEditFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );
  const [nickname, setNickname] = useState(initialNickname);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <Header title="프로필 수정" />
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={nickname}
              width={96}
              height={96}
              unoptimized={previewUrl.startsWith("blob:")}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-2xl font-semibold text-brand-600">
              {nickname.slice(0, 1)}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            name="avatar"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outlined"
            className="w-auto px-4"
            onClick={() => fileInputRef.current?.click()}
          >
            사진 변경
          </Button>
          {state.errors?.avatar?.[0] && (
            <p className="text-xs text-[#FF5F5F]">{state.errors.avatar[0]}</p>
          )}
        </div>
        <Input
          id="nickname"
          name="nickname"
          label="닉네임"
          placeholder="2~20자로 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          error={state.errors?.nickname?.[0]}
        />
        {state.message && (
          <p className="text-sm text-[#FF5F5F]" aria-live="polite">
            {state.message}
          </p>
        )}
      </div>
      <FixedBottomCTA>
        <Button type="submit" disabled={pending}>
          {pending ? "저장 중..." : "저장"}
        </Button>
      </FixedBottomCTA>
    </form>
  );
}
