import { useState } from "react"

export const useCounter = (initialCount: number = 0) => {
  const [count, setCount] = useState<number>(initialCount)

  const increase = () => setCount((prev) => prev + 1)
  const decrease = () => setCount((prev) => prev - 1)

  return { count, increase, decrease }
}
