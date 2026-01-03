export interface TodoResponse {
  userId: number
  id: number
  title: string
  completed: boolean
}

export const fetchTodos = async (): Promise<TodoResponse[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  return response.json()
}
