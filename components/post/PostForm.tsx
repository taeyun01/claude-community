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

type PollOptionField = {
  key: string;
  dbId: string | null;
  label: string;
};

type InitialPoll = {
  question: string;
  options: { id: string; label: string }[];
};

type PostFormProps = {
  mode?: "create" | "edit";
  postId?: string;
  initialTitle?: string;
  initialContent?: string;
  initialPoll?: InitialPoll | null;
};

function newOption(dbId: string | null = null, label = ""): PollOptionField {
  return { key: crypto.randomUUID(), dbId, label };
}

export default function PostForm({
  mode = "create",
  postId,
  initialTitle = "",
  initialContent = "",
  initialPoll = null,
}: PostFormProps) {
  const action =
    mode === "edit" && postId ? updatePost.bind(null, postId) : createPost;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [values, setValues] = useState<FormValues>({
    title: initialTitle,
    content: initialContent,
  });
  const [pollEnabled, setPollEnabled] = useState(!!initialPoll);
  const [pollQuestion, setPollQuestion] = useState(initialPoll?.question ?? "");
  const [pollOptions, setPollOptions] = useState<PollOptionField[]>(
    initialPoll
      ? initialPoll.options.map((o) => newOption(o.id, o.label))
      : [newOption(), newOption()],
  );

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
        {pollEnabled ? (
          <div className="border-line bg-surface flex flex-col gap-3 rounded-2xl border p-4">
            <input type="hidden" name="pollEnabled" value="true" />
            <div className="flex items-center justify-between">
              <span className="text-ink-900 font-poppins text-sm font-semibold">
                투표
              </span>
              <button
                type="button"
                onClick={() => {
                  setPollEnabled(false);
                  setPollQuestion("");
                  setPollOptions([newOption(), newOption()]);
                }}
                className="text-ink-600 cursor-pointer text-xs"
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
                <div key={option.key} className="flex items-center gap-2">
                  <input
                    type="hidden"
                    name="pollOptionIds"
                    value={option.dbId ?? ""}
                  />
                  <div className="flex-1">
                    <Input
                      id={`pollOption-${option.key}`}
                      name="pollOptions"
                      placeholder={`선택지 ${index + 1}`}
                      value={option.label}
                      onChange={(e) =>
                        setPollOptions((prev) =>
                          prev.map((o) =>
                            o.key === option.key
                              ? { ...o, label: e.target.value }
                              : o,
                          ),
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    aria-label="선택지 삭제"
                    disabled={pollOptions.length <= 2}
                    onClick={() =>
                      setPollOptions((prev) =>
                        prev.filter((o) => o.key !== option.key),
                      )
                    }
                    className="text-ink-600 h-11 w-8 shrink-0 cursor-pointer text-lg disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            {state.errors?.pollOptions?.[0] && (
              <p className="text-xs text-[#FF5F5F]">
                {state.errors.pollOptions[0]}
              </p>
            )}
            <button
              type="button"
              onClick={() => setPollOptions((prev) => [...prev, newOption()])}
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
            + 투표 추가
          </button>
        )}
        {state.message && (
          <p className="text-sm text-[#FF5F5F]" aria-live="polite">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
