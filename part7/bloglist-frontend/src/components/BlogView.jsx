import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { addComment } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
const BlogView = ({ blog, handleLike, handleDelete, user }) => {
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  if(!blog){
    return null
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href="">{blog.url}</a>
      <p>{blog.likes} likes <button onClick={() => handleLike(blog)}>Like</button></p>
      <p>Added by {blog.author}</p>
      {user.user === blog.user.username &&
      <button onClick={() => {
        navigate('/')
        handleDelete(blog.id)
      }}>Delete</button>}

      <h3>comments</h3>
      <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} /><button onClick={(e) => {
        dispatch(addComment(blog,comment))
        setComment('')

      }
      }>add comment</button>
      <ul>
        {blog.comments.map((comment,ind) => (
          <li key={ind}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}
BlogView.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    author: PropTypes.string,
    id: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.string),
    user: PropTypes.object,
    likes: PropTypes.number
  }),
  handleLike: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}
export default BlogView