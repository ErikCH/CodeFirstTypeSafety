"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Schema } from "../../amplify/data/resource";

const Post = ({
  post,
  onDelete,
  isSignedIn,
}: {
  post: Pick<Schema["Post"], "title" | "id">;
  onDelete: (id: string) => void;
  isSignedIn: boolean;
}) => {
  const router = useRouter();
  const onDetail = () => {
    router.push(`posts/${post.id}`);
  };
  return (
    <div className="border bg-gray-100 w-full p-4 rounded flex justify-between ">
      <button onClick={onDetail}>
        <div className="flex gap-2">
          <div>Title:</div>
          <div>{post.title}</div>
        </div>
      </button>
      <input type="hidden" name="id" id="id" value={post.id} />
      {isSignedIn ? (
        <button
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(post.id)}
        >
          X
        </button>
      ) : null}
    </div>
  );
};

export default Post;
