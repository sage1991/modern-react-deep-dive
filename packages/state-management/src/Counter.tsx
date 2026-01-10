import { useCount } from "./store/useCount"

export const Counter = () => {
  const { count, increase } = useCount()
  console.log("Counter rendered")
  return <button onClick={increase}>count is {count}</button>
}
