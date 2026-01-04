import type { NextPageContext } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function HiAll({
  segments: serverProps
}: {
  segments: string[]
}) {
  const {
    query: { segments }
  } = useRouter()

  useEffect(() => {
    console.log(segments)
    console.log(JSON.stringify(segments) === JSON.stringify(serverProps)) // true
  }, [segments, serverProps])

  return (
    <>
      hi{" "}
      <ul>
        {serverProps.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  )
}

export const getServerSideProps = (context: NextPageContext) => {
  const {
    query: { props }
  } = context

  return {
    props: {
      props
    }
  }
}
