import CommentItem from "@/components/comment/CommentItem";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  deleted_at: string | null;
  authorNickname: string;
  authorAvatarUrl: string | null;
  isOwner: boolean;
};

export default function CommentList({
  postId,
  comments,
}: {
  postId: string;
  comments: Comment[];
}) {
  if (comments.length === 0) {
    return (
      <p className="px-4 py-4 text-sm text-gray-500">
        아직 댓글이 없어요. 첫 댓글을 남겨보세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-[#EBEBEB]">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          postId={postId}
          content={comment.content}
          createdAt={comment.created_at}
          deletedAt={comment.deleted_at}
          authorNickname={comment.authorNickname}
          authorAvatarUrl={comment.authorAvatarUrl}
          isOwner={comment.isOwner}
        />
      ))}
    </div>
  );
}
