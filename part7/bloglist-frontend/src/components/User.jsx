import { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'
import usersService from '../services/users'

const User = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll()
      .then(res => {
        setUsers(res)
      })
  },[])

  const match = useMatch('/users/:id')
  const user = match
    ? users.find(u => u.id === match.params.id)
    : null


  if(!user){
    return null
  }
  console.log(user)

  return (
    <div>
      <h1>{user.username}</h1>
      <p>added blogs</p>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User