import { hydrateRoot } from "react-dom/client"

import { App } from "./components/App"
import { fetchTodos } from "./fetch"

const bootstrap = async () => {
  const root = document.querySelector<HTMLDivElement>("#root")
  if (!root) {
    return
  }

  const todos = await fetchTodos()
  hydrateRoot(root, <App todos={todos} />)
}

void bootstrap()
