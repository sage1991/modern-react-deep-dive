import type { User } from "../../types/User"

interface Props {
  data: User
}

const UserPage = ({ data }: Props) => {
  return (
    <main>
      <h1>{data.name}</h1>
      <p>@{data.username}</p>
      <ul>
        <li>Email: {data.email}</li>
        <li>Phone: {data.phone}</li>
        <li>Website: {data.website}</li>
      </ul>
    </main>
  )
}

export default UserPage

export const getStaticProps = async (id: number) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  )
  const data: User = await response.json()
  return { data }
}

export const getStaticPaths = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  const data: User[] = await response.json()
  return data.map(({ id }) => id)
}
