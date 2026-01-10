import { counter } from "./counter"
import { useSelector } from "./useSelector"

export const useCountSelector = () => {
  return useSelector({ store: counter, selector: ({ count }) => count })
}
