import { useEffect } from "react"

import type { TodoResponse } from "../fetch"
import { Todo } from "./Todo"

interface Props {
  todos: TodoResponse[]
}

export const App = ({ todos }: Props) => {
  useEffect(() => {
    console.log("Hello from App.tsx!")
  }, [])

  return (
    <>
      <h1>나의 할 일!</h1>
      <ul>
        {todos.map(({ id, userId, title, completed }) => {
          return (
            <Todo
              key={id}
              userId={userId}
              id={id}
              title={title}
              completed={completed}
            />
          )
        })}
      </ul>
    </>
  )
}
