import { counter, type CounterState } from "./counter"
import { useStore } from "./useStore"

export const useCounterMemo = () => {
  const [{ memo }, setCounter] = useStore<CounterState>(counter)

  const update = () =>
    setCounter((prev) => ({ ...prev, memo: `${Date.now()}` }))

  return { memo, update }
}
