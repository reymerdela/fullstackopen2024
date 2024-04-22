import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, NEW_BIRTH_YEAR } from '../querys'
import { useState } from 'react'

const Authors = (props) => {
  const [name, setName] = useState('')
  const result = useQuery(ALL_AUTHORS, {
    onCompleted: (data) => {
      console.log(data)
      if (data.allAuthors.length > 0) {
        setName(data.allAuthors[0].name)
      }
    },
    onError: (error) => {
      console.log(error.message)
    },
  })
  const [newBirthMutation] = useMutation(NEW_BIRTH_YEAR, {
    refetchQueries: [ALL_AUTHORS],
    onError: (error) => {
      console.log('Error:', error.message)
    },
  })

  if (result.error) {
    return (
      <div style={{ color: 'red', fontSize: '32px', padding: '20px' }}>
        No se pudo conectar con el servidor
      </div>
    )
  }
  if (!props.show) {
    return null
  }

  const authors = result.loading ? [] : result.data.allAuthors
  const handleNewBirth = (e) => {
    e.preventDefault()
    const born = e.target.born.value
    newBirthMutation({ variables: { name, setBornTo: Number(born) } })
  }

  const authorForm = () => {
    return (
      <form onSubmit={handleNewBirth}>
        <h3>Set birthyear</h3>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born <input name="born" />
        </div>
        <button type="submit">update author</button>
      </form>
    )
  }

  return (
    <div>
      <h2>authors</h2>
      {result.loading && <p>Loading...</p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && authorForm()}
    </div>
  )
}

export default Authors
