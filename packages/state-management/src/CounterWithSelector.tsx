import { counter } from "./store/counter"
import { useCountSelector } from "./store/useCountSelector"

export const CounterWithSelector = () => {
  const count = useCountSelector()
  console.log("CounterWithSelector rendered")

  const increase = () =>
    counter.set((prev) => ({ ...prev, count: prev.count + 1 }))

  return <button onClick={increase}>count is {count}</button>
}
