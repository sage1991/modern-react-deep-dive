import type { User } from "../../types/User"

interface Props {
  data: User[]
}

const UserListPage = ({ data }: Props) => {
  return (
    <main>
      <h1>Users</h1>
      <ul>
        {data.map(({ id, name }) => {
          return (
            <li key={id}>
              <a href={`/users/${id}`}>{name}</a>
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default UserListPage

export const getStaticProps = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  const data: User[] = await response.json()
  return { data }
}
