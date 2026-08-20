import Image from "next/image";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import CommentMenu from "@/components/comment/CommentMenu";

type CommentItemProps = {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  authorNickname: string;
  authorAvatarUrl: string | null;
  isOwner: boolean;
};

export default function CommentItem({
  id,
  postId,
  content,
  createdAt,
  deletedAt,
  authorNickname,
  authorAvatarUrl,
  isOwner,
}: CommentItemProps) {
  const isDeleted = deletedAt !== null;

  return (
    <div className="flex items-start gap-2 px-4 py-2">
      {authorAvatarUrl ? (
        <Image
          src={authorAvatarUrl}
          alt={authorNickname}
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-600">
          {authorNickname.slice(0, 1)}
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-poppins text-sm font-semibold text-gray-900">
            {authorNickname}
          </span>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        {isDeleted ? (
          <p className="text-sm text-gray-400 italic">삭제된 댓글입니다.</p>
        ) : (
          <p className="text-sm whitespace-pre-line text-gray-700">{content}</p>
        )}
      </div>
      {isOwner && !isDeleted && <CommentMenu commentId={id} postId={postId} />}
    </div>
  );
}
