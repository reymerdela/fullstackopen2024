import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'
const Users = () => {
  const [users,setUsers] = useState([])

  useEffect(() => {
    usersService.getAll()
      .then(res => {
        console.log(res)
        setUsers(res)
      })
  },[])


  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`} >{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object)
}

export default Users