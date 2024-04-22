import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../querys'

const Favorites = ({ show, genre }) => {
  const result = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  const books = result.data ? result.data.allBooks : []
  if (!show) {
    return null
  }
  if (!genre) {
    return <div>No favorite genres</div>
  }
  const favoriteTable = () => (
    <table>
      <thead>
        <tr>
          <td></td>
          <td>
            <strong>author</strong>
          </td>
          <td>
            <strong>published</strong>
          </td>
        </tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.id}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
  console.log('Genre', genre)
  return (
    <div>
      <h2>Recomendations</h2>
      <p>
        books in your favorite genre <strong>{genre}</strong>
      </p>
      {books.length > 0 ? favoriteTable() : <p>No books to show</p>}
    </div>
  )
}

export default Favorites
