import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import PropType from 'prop-types'
const User = ({ id }) => {
  const query = useQuery({ queryKey: ['user'],queryFn:() => axios.get(`http://localhost:3003/api/users/${id}`).then(result => result.data) })
  const user = query.data


  return (
    <div>
      <h2>{user?.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user?.blogs.length < 1 && <p>Empty blogs</p>}
        {user?.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

User.propTypes = {
  id: PropType.string
}
export default User