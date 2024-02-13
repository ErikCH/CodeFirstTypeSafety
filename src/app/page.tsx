import Post from "@/components/Post";
import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import { onDeletePost } from "./_actions/actions";

export default async function Home() {

  const { data: posts } = await cookieBasedClient.models.Post.list({
    selectionSet: ["title", "id", "comments.*"],
    authMode: "apiKey",
  });

  const { data: allComments } = await cookieBasedClient.models.Comment.list({
    selectionSet: ["content", "id"],
    authMode: "apiKey",
  });


  const updatePost = {
    title: "New Titlesssssss",
    comments: allComments
  };

  const updatedModel = await cookieBasedClient.models.Post.update({
    id: posts[0].id
    , ...updatePost
  });

  console.log("updated model", updatedModel);




  return (
    <main className="flex flex-col items-center justify-between p-24 w-1/2 m-auto">
      <h1 className="text-2xl pb-10">List Of All Titles</h1>
      {posts?.map(async (post, idx) => (
        <Post
          onDelete={onDeletePost}
          post={post}
          key={idx}
          isSignedIn={await isAuthenticated()}
        />
      ))}
    </main>
  );
}
