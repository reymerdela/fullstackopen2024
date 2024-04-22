import { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Notification from './components/Notificaion'
import { useApolloClient, useSubscription } from '@apollo/client'
import Favorites from './components/Favorites'
import { BOOKS_ADDED } from './querys'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [message, setMessage] = useState('')
  const client = useApolloClient()
  useSubscription(BOOKS_ADDED, {
    onData: ({ data }) => {
      const newBook = data.data.bookAdded
      setMessage(`Libro: ${newBook.title} agregado!`)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('login_jwt_token'))
    if (token) {
      setToken(token)
    }
  }, [])

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={logout}>logout</button>
            <button onClick={() => setPage('favorites')}>recommended</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Notification message={message} />
      <Favorites
        genre={token?.user.favoriteGenre}
        show={page === 'favorites' && token}
      />
      <Authors show={page === 'authors'} token={token} />
      <Login show={page === 'login'} setToken={setToken} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
