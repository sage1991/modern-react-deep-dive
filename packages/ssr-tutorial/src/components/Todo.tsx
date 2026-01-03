import { useState } from "react"

interface Props {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const Todo = ({ userId, id, title, completed }: Props) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(completed)

  const onToggleClick = () => {
    setIsCompleted((prev) => !prev)
  }

  return (
    <li>
      <span>
        {userId}-{id}) {title} {isCompleted ? "완료" : "미완료"}
        <button onClick={onToggleClick}>토글</button>
      </span>
    </li>
  )
}
