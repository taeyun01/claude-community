"use client";

import { useActionState, useState } from "react";
import Header from "@/components/nav/Header";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { createPost, updatePost, type PostState } from "@/lib/actions/posts";

const initialState: PostState = {};

type FormValues = {
  title: string;
  content: string;
};

type PostFormProps = {
  mode?: "create" | "edit";
  postId?: string;
  initialTitle?: string;
  initialContent?: string;
};

export default function PostForm({
  mode = "create",
  postId,
  initialTitle = "",
  initialContent = "",
}: PostFormProps) {
  const action =
    mode === "edit" && postId ? updatePost.bind(null, postId) : createPost;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [values, setValues] = useState<FormValues>({
    title: initialTitle,
    content: initialContent,
  });

  return (
    <form action={formAction} className="flex flex-1 flex-col">
      <Header
        title={mode === "edit" ? "글 수정" : "글쓰기"}
        action={{
          label: pending ? "저장 중..." : "저장",
          type: "submit",
          disabled: pending,
        }}
      />
      <div className="flex flex-1 flex-col gap-4 px-4 py-6">
        <Input
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          error={state.errors?.title?.[0]}
          value={values.title}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <Textarea
          id="content"
          name="content"
          placeholder="내용을 입력해주세요"
          rows={6}
          error={state.errors?.content?.[0]}
          value={values.content}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, content: e.target.value }))
          }
        />
        {state.message && (
          <p className="text-sm text-[#FF5F5F]" aria-live="polite">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
