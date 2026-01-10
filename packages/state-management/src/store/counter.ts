import { createStore } from "./createStore"

export interface CounterState {
  count: number
  memo: string
}

export const counter = createStore<CounterState>({ count: 0, memo: "" })
