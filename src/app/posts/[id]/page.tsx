import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import { addComment, deleteComment } from "@/app/_actions/actions";
import AddComment from "@/components/AddComment";
import React from "react";
import { Schema } from "../../../../amplify/data/resource";

const Posts = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const isSignedIn = await isAuthenticated();
  const { data: post } = await cookieBasedClient.models.Post.get(
    {
      id: params.id,
    },
    {
      authMode: "apiKey",
      selectionSet: ["id", "title"],
    }
  );
  const { data: allComments } = await cookieBasedClient.models.Comment.list({
    authMode: "apiKey",
    selectionSet: ["content", "post.id", "id"],
  });

  const comments = allComments.filter(
    (comment) => comment.post.id === params.id
  );

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-2xl font-bold">Post Information:</h1>
      <div className="border rounded w-1/2 m-auto bg-gray-200 p-4 ">
        <h2>Title: {post.title}</h2>
      </div>

      {isSignedIn ? (
        <AddComment
          addComment={addComment}
          paramsId={params.id}
          post={post as Schema["Post"]["type"]}
        />
      ) : null}

      <h1 className="text-xl font-bold">Comments:</h1>
      {comments.map((comment, idx) => (
        <div key={idx}>
          <div className="w-96 p-2 rounded border bg-yellow-100 flex justify-between">
            <div>{comment.content}</div>
            <form
              action={async (formData) => {
                "use server";
                await deleteComment(formData);
                revalidatePath(`/posts/${params.id}`);
              }}
            >
              <input type="hidden" name="id" id="id" value={comment.id} />
              {isSignedIn ? (
                <button type="submit" className="text-red-950">
                  X
                </button>
              ) : null}
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
