import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { LOGIN } from '../querys'

const Login = ({ show, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.message)
    },
    onCompleted: (result) => {
      console.log('token:', result.login)
      setToken(result.login)
      localStorage.setItem('login_jwt_token', JSON.stringify(result.login))
    },
  })

  if (!show) {
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
    setPassword('')
    setUsername('')
    setToken()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name{' '}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}
export default Login
