import { counter, type CounterState } from "./counter"
import { useStore } from "./useStore"

export const useCount = () => {
  const [{ count }, setCounter] = useStore<CounterState>(counter)

  const increase = () =>
    setCounter((prev) => ({ ...prev, count: prev.count + 1 }))
  const decrease = () =>
    setCounter((prev) => ({ ...prev, count: prev.count - 1 }))

  return { count, increase, decrease }
}
