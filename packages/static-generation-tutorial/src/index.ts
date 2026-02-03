import { PromisePool } from "@supercharge/promise-pool"
import { mkdir, readdir, rm, stat, writeFile } from "fs/promises"
import path from "path"
import { createElement } from "react"
import { renderToString } from "react-dom/server"

import { Layout } from "./layout"

const pageRoot = path.resolve(import.meta.dirname, "pages")
const dist = path.resolve(import.meta.dirname, "../dist")

const main = async () => {
  const pages = await collectPages(pageRoot)
  await rm(dist, { recursive: true, force: true })
  for (let i = 0; i < pages.length; i++) {
    await build(pages[i]!)
  }
}

const collectPages = async (root: string) => {
  const files = await readdir(root)

  const result: string[] = []
  for (let i = 0; i < files.length; i++) {
    const filePath = path.resolve(root, files[i]!)
    const stats = await stat(filePath)
    if (stats.isFile() && filePath.endsWith(".tsx")) {
      result.push(filePath)
    }
    if (stats.isDirectory()) {
      result.push(...(await collectPages(filePath)))
    }
  }

  return result
}

const build = async (file: string) => {
  const {
    default: Page,
    getStaticProps = () => Promise.resolve(),
    getStaticPaths
  } = await import(file)
  const basename = path.basename(file, ".tsx")
  const isDynamicPath = /^\[(\w+)]$/.test(basename)

  if (isDynamicPath) {
    const params: number[] = await getStaticPaths()
    return PromisePool.for(params)
      .withConcurrency(10)
      .process(async (param) => {
        const props = await getStaticProps(param)
        const html = `<!DOCTYPE html>${renderToString(createElement(Layout, undefined, createElement(Page, props)))}`
        const filePath = path.resolve(
          dist,
          `${path.relative(pageRoot, file).replace(/\[(\w+)].tsx$/, `${param}.html`)}`
        )
        await mkdir(path.dirname(filePath), { recursive: true })
        await writeFile(filePath, html, { encoding: "utf-8" })
        console.log("Generate: ", filePath)
      })
  }

  const props = await getStaticProps()
  const html = `<!DOCTYPE html>${renderToString(createElement(Layout, undefined, createElement(Page, props)))}`
  const filePath = path.resolve(
    dist,
    `${path.relative(pageRoot, file).replace(/.tsx$/, ".html")}`
  )
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, html, { encoding: "utf-8" })
  console.log("Generate: ", filePath)
}

void main()
