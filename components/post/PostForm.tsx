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
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

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
        {mode === "create" &&
          (pollEnabled ? (
            <div className="flex flex-col gap-3 rounded-2xl border border-[#EBEBEB] p-4">
              <input type="hidden" name="pollEnabled" value="true" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  투표
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setPollEnabled(false);
                    setPollQuestion("");
                    setPollOptions(["", ""]);
                  }}
                  className="cursor-pointer text-xs text-gray-500"
                >
                  삭제
                </button>
              </div>
              <Input
                id="pollQuestion"
                name="pollQuestion"
                placeholder="투표 질문을 입력해주세요"
                error={state.errors?.pollQuestion?.[0]}
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
              <div className="flex flex-col gap-2">
                {pollOptions.map((option, index) => (
                  <Input
                    key={index}
                    id={`pollOption-${index}`}
                    name="pollOptions"
                    placeholder={`선택지 ${index + 1}`}
                    value={option}
                    onChange={(e) =>
                      setPollOptions((prev) =>
                        prev.map((value, i) =>
                          i === index ? e.target.value : value,
                        ),
                      )
                    }
                  />
                ))}
              </div>
              {state.errors?.pollOptions?.[0] && (
                <p className="text-xs text-[#FF5F5F]">
                  {state.errors.pollOptions[0]}
                </p>
              )}
              <button
                type="button"
                onClick={() => setPollOptions((prev) => [...prev, ""])}
                className="w-fit cursor-pointer text-xs font-medium text-brand-600"
              >
                선택지 추가
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPollEnabled(true)}
              className="w-fit cursor-pointer rounded-full border border-brand-600 px-3 py-1 text-xs font-medium text-brand-600"
            >
              투표 추가
            </button>
          ))}
        {state.message && (
          <p className="text-sm text-[#FF5F5F]" aria-live="polite">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
