import type { Todo } from "../../types/Todo"

interface Props {
  data: Todo[]
}

const TodoListPage = ({ data }: Props) => {
  return (
    <main>
      <h1>Todos</h1>
      <ul>
        {data.map(({ id, title, completed }) => {
          return (
            <li key={id}>
              <input type="checkbox" defaultChecked={completed} />
              <a href={`/todos/${id}.html`}>{title}</a>
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
