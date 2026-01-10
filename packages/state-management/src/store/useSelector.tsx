import { useCallback, useRef, useSyncExternalStore } from "react"

import type { Store } from "./createStore"

interface Config<State, Value> {
  store: Store<State>
  selector: (state: State) => Value
}

export const useSelector = <State, Value>({
  store,
  selector
}: Config<State, Value>) => {
  const selectorRef = useRef<(state: State) => Value>(selector)
  // eslint-disable-next-line react-hooks/refs
  selectorRef.current = selector

  const getSnapshot = useCallback(
    () => selectorRef.current(store.get()),
    [store]
  )

  return useSyncExternalStore(store.subscribe, getSnapshot)
}
