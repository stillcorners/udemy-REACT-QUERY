import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
    const nextPage = currentPage + 1;
    queryClient.prefetchQuery({
      queryKey: ["posts", nextPage],
      queryFn: () => fetchPosts(nextPage)
      });
    }
  }, [currentPage, queryClient])

  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts", currentPage], // 1. posts에서 [selectedPost, setSelectedPost] 의 상태를 담고 있음
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, // 2s
  });
  if (isLoading) {
    return <h3>로딩중! </h3>;
  };
  if (isError) {
    <>
      <h3>에러 발생!</h3>
    </>
  }

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)} // 2. 제목을 클릭하면 선택한 포스트를 해당 포스트에 대한 데이터로 설정
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1)
          }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1)
          }}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
      {/* 3. 선택된 포스트 데이터를 PostDetail 컴포넌트에 속성으로 전달 */}
    </>
  );
}
