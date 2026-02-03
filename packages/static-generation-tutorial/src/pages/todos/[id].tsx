import type { Todo } from "../../types/Todo"

interface Props {
  data: Todo
}

const TodoPage = ({ data }: Props) => {
  return (
    <main>
      <h1>{data.title}</h1>
      <p>Status: {data.completed ? "Completed" : "Pending"}</p>
      <p>User ID: {data.userId}</p>
    </main>
  )
}

export default TodoPage

export const getStaticProps = async (id: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  )
  const data: Todo = await response.json()
  return { data }
}

export const getStaticPaths = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  const data: Todo[] = await response.json()
  return data.map(({ id }) => id)
}
