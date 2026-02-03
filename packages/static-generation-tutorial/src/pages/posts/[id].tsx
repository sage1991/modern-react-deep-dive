import type { Post } from "../../types/Post"

interface Props {
  data: Post
}

const PostPage = ({ data }: Props) => {
  return (
    <main>
      <h1>{data.title}</h1>
      <p>{data.body}</p>
    </main>
  )
}

export default PostPage

export const getStaticProps = async (id: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  )
  const data: Post = await response.json()
  return { data }
}

export const getStaticPaths = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts")
  const data: Post[] = await response.json()
  return data.map(({ id }) => id)
}
