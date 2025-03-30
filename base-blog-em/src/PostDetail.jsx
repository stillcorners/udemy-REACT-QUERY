import { fetchComments } from "./api";
import { useQuery } from "@tanstack/react-query";
import { useState} from "react";;
import "./PostDetail.css";

export function PostDetail({ post }) {
  const [currentComment, setCurrentComment] = useState(0);
  const [selectedComment, setSelectedComment] = useState(null);

  const postId = post.id;

  const { data, isError, isLoading, error } = useQuery ({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    staleTime: 2000,
  });
  if (isLoading) {
    return <h3>댓글 가져오는 중!</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>댓글 가져오기 실패</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
