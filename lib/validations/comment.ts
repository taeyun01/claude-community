import { z } from "zod";

export const commentSchema = z.object({
  content: z.string().trim().min(1, "댓글을 입력해주세요."),
});

export type CommentInput = z.infer<typeof commentSchema>;
