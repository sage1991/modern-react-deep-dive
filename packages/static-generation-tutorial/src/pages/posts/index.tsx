import type { Post } from "../../types/Post"

interface Props {
  data: Post[]
}

const PostListPage = ({ data }: Props) => {
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {data.map(({ id, title }) => {
          return (
            <li key={title}>
              <a href={`/posts/${id}`}>{title}</a>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default PostListPage

export const getStaticProps = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts")
  const data: Post[] = await response.json()
  return { data }
}
