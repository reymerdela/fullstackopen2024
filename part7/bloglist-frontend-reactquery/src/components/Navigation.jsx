import { Link } from 'react-router-dom'
import UserContext from '../reducers/userContext'
import { useContext } from 'react'

const Navigation = () => {
  const [user, setUser] = useContext(UserContext)

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loginToken')
  }

  return (
    <div>
      <Link to='/'>blogs</Link>
      <Link to='/users'>users</Link>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}
export default Navigation