import { css } from "@emotion/react"

import type { Todo } from "../../types/Todo"

interface Props {
  data: Todo
}

const styles = {
  main: css`
    margin-top: 0.5rem;
  `,
  h1: css`
    font-size: 1.75rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1.25rem;
  `,
  p: css`
    color: #6b7280;
  `
}

const TodoPage = ({ data }: Props) => {
  return (
    <main css={styles.main}>
      <h1 css={styles.h1}>{data.title}</h1>
      <p css={styles.p}>Status: {data.completed ? "Completed" : "Pending"}</p>
      <p css={styles.p}>User ID: {data.userId}</p>
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
