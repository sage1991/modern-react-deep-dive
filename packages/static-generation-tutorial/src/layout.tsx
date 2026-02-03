import type { ReactNode } from "react"

interface Props {
  children?: ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <title>⭐️Static Generation Tutorial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  )
}
