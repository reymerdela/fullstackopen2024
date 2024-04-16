import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {


  return (
    <nav>
      <Link to='/'>Blog</Link>
      <Link to='/users'>Users</Link>
      <p>{user} logged in</p>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )


}

export default Navigation