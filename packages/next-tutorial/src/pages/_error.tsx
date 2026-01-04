import type { NextPageContext } from "next"

interface Props {
  statusCode?: number
}

const Error = ({ statusCode }: Props) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  return { statusCode: res?.statusCode ?? err?.statusCode }
}

export default Error
