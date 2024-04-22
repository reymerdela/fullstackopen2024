import { useQuery } from '@apollo/client'
import { ALL_BOOKS, BOOKS_ADDED } from '../querys'
import { useEffect, useMemo, useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const { data, error, refetch, subscribeToMore } = useQuery(ALL_BOOKS, {
    variables: { genre },
  })
  const genres = useMemo(() => new Set(), [])
  const books = data ? data.allBooks : []
  useEffect(() => {
    subscribeToMore({
      document: BOOKS_ADDED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev
        }
        const newBook = subscriptionData.data.bookAdded
        if (!prev.allBooks.find((book) => book.id === newBook.id)) {
          return {
            allBooks: prev.allBooks.concat(newBook),
          }
        }
        return prev
      },
    })
  }, [subscribeToMore])
  useEffect(() => {
    if (books) {
      books.forEach((book) => {
        book.genres.forEach((genre) => genres.add(genre))
      })
    }
  }, [genres, data])

  if (!props.show) {
    return null
  }

  if (error) {
    return <div>Error en el servidor</div>
  }
  const handleGenreChange = (genre) => {
    setGenre(genre)
    refetch()
  }

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.size > 0 &&
        Array.from(genres).map((genre) => (
          <button key={genre} onClick={() => handleGenreChange(genre)}>
            {genre}
          </button>
        ))}
      <button
        onClick={() => {
          setGenre('')
          refetch()
        }}
      >
        all genres
      </button>
    </div>
  )
}

export default Books
