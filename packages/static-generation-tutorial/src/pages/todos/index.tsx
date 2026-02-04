import { css } from "@emotion/react"

import type { Todo } from "../../types/Todo"

interface Props {
  data: Todo[]
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
  ul: css`
    list-style: none;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  `,
  li: css`
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
  `,
  checkbox: css`
    margin-right: 0.625rem;
  `,
  link: css`
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  `
}

const TodoListPage = ({ data }: Props) => {
  return (
    <main css={styles.main}>
      <h1 css={styles.h1}>Todos</h1>
      <ul css={styles.ul}>
        {data.map(({ id, title, completed }) => {
          return (
            <li key={id} css={styles.li}>
              <input
                type="checkbox"
                defaultChecked={completed}
                css={styles.checkbox}
              />
              <a href={`/todos/${id}`} css={styles.link}>
                {title}
              </a>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default TodoListPage

export const getStaticProps = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  const data: Todo[] = await response.json()
  return { data }
}
