import { useState } from 'react'
import Notification from './Notification'
import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit }) => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  const handleUser = ({ target: { value } }) => {
    setLoginData({ ...loginData, username: value })
  }

  const handlePassword = ({ target: { value } }) => {
    setLoginData({ ...loginData, password: value })
  }

  return (
    <div>
      <h1>log in to application</h1>
      <Notification />
      <form
        onSubmit={(e) => {
          setLoginData({ username: '', password: '' })
          handleSubmit(e, loginData)
        }}
      >
        <div>
          <label htmlFor="">
            username{' '}
            <input
              type="text"
              value={loginData.username}
              onChange={handleUser}
            />
          </label>
        </div>
        <div>
          <label htmlFor="">
            password{' '}
            <input
              type="text"
              value={loginData.password}
              onChange={handlePassword}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
  }),
}
export default LoginForm
