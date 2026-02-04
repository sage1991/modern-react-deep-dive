import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { renderStylesToString } from "@emotion/server"
import { PromisePool } from "@supercharge/promise-pool"
import { copyFile, mkdir, readdir, rm, stat, writeFile } from "fs/promises"
import path from "path"
import { createElement, type ReactElement } from "react"
import { renderToString } from "react-dom/server"

import { Layout } from "./layout"

const pageRoot = path.resolve(import.meta.dirname, "pages")
const dist = path.resolve(import.meta.dirname, "../dist")

const main = async () => {
  // 페이지 정보 수집
  const pages = await collectPages(pageRoot)

  await rm(dist, { recursive: true, force: true })

  // css 파일 복사
  await mkdir(dist, { recursive: true })
  await copyFile(
    path.resolve(import.meta.dirname, "styles.css"),
    path.resolve(dist, "styles.css")
  )

  // render dom string
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

/**
 * ============================================================================
 * Emotion SSR (Server-Side Rendering) 스타일 추출 방식 비교
 * ============================================================================
 *
 * Emotion을 SSR/SSG에서 사용할 때 스타일을 HTML에 삽입하는 두 가지 방식이 있다.
 *
 * ----------------------------------------------------------------------------
 * [옵션 1] 수동 스타일 추출 방식 - createEmotionServer 사용
 * ----------------------------------------------------------------------------
 *
 * 특징:
 * - 스타일이 <head> 안에 한 덩어리로 위치
 * - 브라우저가 body 렌더링 전에 모든 스타일을 파싱
 * - 더 전통적인 CSS 로딩 방식
 *
 * 동작 원리:
 * 1. createCache()로 Emotion 캐시 생성
 * 2. createEmotionServer(cache)로 서버 유틸리티 생성
 * 3. renderToString()으로 React → HTML 변환 (이때 캐시에 스타일 수집됨)
 * 4. extractCriticalToChunks()로 사용된 스타일만 추출
 * 5. constructStyleTagsFromChunks()로 <style> 태그 문자열 생성
 * 6. Layout의 <head>에 스타일 문자열 주입
 *
 * 장점:
 * - 스타일이 <head>에 위치하여 표준적
 * - 스타일 위치를 직접 제어 가능
 *
 * 단점:
 * - 코드가 복잡함 (추출 → 변환 → 주입 단계)
 * - 페이지와 Layout을 별도로 렌더링해야 함 (2번 렌더링)
 *
 * 구현 예시:
 * ```
 * import createEmotionServer from "@emotion/server/create-instance"
 *
 * const renderWithEmotion = (element: ReactElement) => {
 *   const cache = createCache({ key: "css" })
 *   const { extractCriticalToChunks, constructStyleTagsFromChunks } =
 *     createEmotionServer(cache)
 *
 *   const html = renderToString(
 *     createElement(CacheProvider, { value: cache }, element)
 *   )
 *
 *   const chunks = extractCriticalToChunks(html)
 *   const styles = constructStyleTagsFromChunks(chunks)
 *
 *   return { html, styles }
 * }
 *
 * // 사용:
 * const { html: pageHtml, styles } = renderWithEmotion(createElement(Page, props))
 * // Layout에 emotionStyles prop으로 styles 전달하여 <head>에 주입
 * ```
 *
 * ----------------------------------------------------------------------------
 * [옵션 2] 자동 스타일 삽입 방식 - renderStylesToString 사용 (현재 적용됨)
 * ----------------------------------------------------------------------------
 *
 * 특징:
 * - 스타일이 <body> 안에서 각 요소 직전에 분산 삽입
 * - 스트리밍 SSR에 최적화
 * - 점진적 렌더링에 유리
 *
 * 동작 원리:
 * 1. createCache()로 Emotion 캐시 생성
 * 2. renderToString()으로 전체 (Layout + Page) 한 번에 렌더링
 * 3. renderStylesToString()이 HTML을 스캔하여 각 요소 앞에 <style> 태그 자동 삽입
 *
 * 장점:
 * - 코드가 간결함 (한 줄로 처리)
 * - 한 번의 렌더링으로 완료
 * - 스트리밍 SSR과 호환
 *
 * 단점:
 * - 스타일이 <head>가 아닌 <body>에 위치
 * - 스타일 위치를 직접 제어 불가
 *
 * 출력 예시:
 * ```html
 * <body>
 *   <style data-emotion="css abc">.css-abc{...}</style>
 *   <main class="css-abc">
 *     <style data-emotion="css def">.css-def{...}</style>
 *     <h1 class="css-def">Title</h1>
 *   </main>
 * </body>
 * ```
 * ============================================================================
 */

/** [옵션 2 구현] renderStylesToString으로 스타일 자동 삽입 */
const renderPageToHtml = (pageElement: ReactElement) => {
  const cache = createCache({ key: "css" })

  const html = renderStylesToString(
    renderToString(
      createElement(
        CacheProvider,
        { value: cache },
        createElement(Layout, undefined, pageElement)
      )
    )
  )

  return `<!DOCTYPE html>${html}`
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
        const html = renderPageToHtml(createElement(Page, props))
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
  const html = renderPageToHtml(createElement(Page, props))
  const filePath = path.resolve(
    dist,
    `${path.relative(pageRoot, file).replace(/.tsx$/, ".html")}`
  )
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, html, { encoding: "utf-8" })
  console.log("Generate: ", filePath)
}

void main()
