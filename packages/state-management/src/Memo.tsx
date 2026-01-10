import { useCounterMemo } from "./store/useCounterMemo"

export const Memo = () => {
  const { memo, update } = useCounterMemo()
  return <button onClick={update}>memo is {memo}</button>
}
