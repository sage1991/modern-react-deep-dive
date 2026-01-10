import { useEffect, useState } from "react"

import type { Store } from "./createStore"

export const useStore = <State>(store: Store<State>) => {
  const [state, setState] = useState<State>(() => store.get())

  useEffect(() => {
    return store.subscribe(setState)
  }, [store])

  return [state, store.set] as const
}
