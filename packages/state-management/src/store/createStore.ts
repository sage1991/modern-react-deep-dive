/**
 * 📝Note. Distributive conditional types
 *
 * T | ((prev: T) => T) 와의 차이점은 union type 에서 나타나는데
 * Conditional type 을 이용하면 union type 을 개별로 분리 할 수 있습니다
 * ```TypeScript
 * type Simple<T> = T | ((prev: T) => T);
 * type Distributed<T> = T extends unknown ? T | ((prev: T) => T) : never
 *
 * // string | number | ((prev: string | number) => string | number)
 * type Result = Simple<string | number>
 *
 * // string | number | ((prev: string) => string) | ((prev: number) => number)
 * type Result = Distributed<string | number>
 * ```
 */
export type Initializer<T> = T extends unknown ? T | ((prev: T) => T) : never

export interface Store<State> {
  get: () => State
  set: (action: Initializer<State>) => State
  subscribe: (listener: (state: State) => void) => () => void
}

class _Store<State> implements Store<State> {
  private state: State
  private listeners = new Set<(state: State) => void>()

  constructor(init: Initializer<State>) {
    this.state = typeof init === "function" ? init() : init
  }

  get = () => {
    return this.state
  }

  set = (action: Initializer<State>) => {
    this.state = typeof action === "function" ? action(this.state) : action
    this.listeners.forEach((listener) => listener(this.state))
    return this.state
  }

  subscribe = (listener: (state: State) => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const createStore = <State>(init: Initializer<State>): Store<State> =>
  new _Store<State>(init)
