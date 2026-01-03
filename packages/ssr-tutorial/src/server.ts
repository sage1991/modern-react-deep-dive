import { createReadStream } from "fs"
import { createServer, type RequestListener } from "http"
import path from "path"
import { createElement } from "react"
import { renderToPipeableStream, renderToString } from "react-dom/server"
import { Writable } from "stream"

import htmlEnd from "../public/index.end.html"
import htmlFront from "../public/index.front.html"
import html from "../public/index.html"
import { App } from "./components/App"
import { fetchTodos } from "./fetch"
import { sleep } from "./utils"

const requestListener: RequestListener = async (request, response) => {
  const { url } = request

  switch (url) {
    case "/": {
      const todos = await fetchTodos()
      const element = createElement(
        "div",
        { id: "root" },
        createElement(App, { todos })
      )
      response.setHeader("Content-Type", "text/html; charset=utf-8")
      response.write(html.replace("__placeholder__", renderToString(element)))
      response.end()
      return
    }
    case "/stream": {
      response.setHeader("Content-Type", "text/html; charset=utf-8")
      response.write(htmlFront)

      await sleep(1000)

      const todos = await fetchTodos()
      const element = createElement(
        "div",
        { id: "root" },
        createElement(App, { todos })
      )

      const stream = renderToPipeableStream(element, {
        bootstrapScripts: ["main.js"],
        onShellReady() {
          stream.pipe(
            new Writable({
              async write(chunk, encoding, callback) {
                await sleep(1000)
                response.write(chunk, encoding, callback)
              },
              async final(callback) {
                await sleep(1000)
                response.end(htmlEnd, callback)
              }
            })
          )
        }
      })
      return
    }
    case "/main.js": {
      response.setHeader("Content-Type", "application/javascript")
      createReadStream(
        path.resolve(import.meta.dirname, "../dist/main.js")
      ).pipe(response)
      return
    }
    case "/main.js.map": {
      response.setHeader("Content-Type", "application/javascript")
      createReadStream(
        path.resolve(import.meta.dirname, "../dist/main.js.map")
      ).pipe(response)
      return
    }
    default:
      response.statusCode = 404
      response.end("404 Not Found")
      return
  }
}

const bootstrap = async () => {
  const PORT = process.env.PORT ?? 3000
  const server = createServer(requestListener)
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
  })
}

void bootstrap()
