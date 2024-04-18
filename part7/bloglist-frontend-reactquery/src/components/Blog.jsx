import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import NotificationContext, { pushNotification } from '../reducers/noticationContext'
import UserContext from '../reducers/userContext'
import { useNavigate } from 'react-router-dom'

function Blog({ blog }) {
  const [user, setUser] = useContext(UserContext)
  const [notification,dispatchNotification] = useContext(NotificationContext)
  const [comment,setComment] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: () => {
      pushNotification(dispatchNotification,'already deleted!')
    }
  })

  const likeMutation = useMutation({
    mutationFn: blogService.updateBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const commentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: () => {
      console.log('Success')
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error) => {
      pushNotification(dispatchNotification,error.response.data.error)
    }
  })


  if (!blog) {
    return null
  }
  const handleComment = () => {
    commentMutation.mutate({ comment,id: blog.id })
    setComment('')
  }

  const handleLike = async (blog) => {
    const data = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    likeMutation.mutate({ data,token: user.token,blogId: blog.id })
  }
  const handleDelete = async (id) => {
    deleteBlogMutation.mutate({ id,token: user.token })
    navigate('/')
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <br />
      <a href={blog.url} target='_blank' rel="noreferrer">{blog.url}</a>
      <p>{blog.likes} likes <button onClick={() => handleLike(blog)}>Like</button></p>
      <p>Added by {blog.author}</p>
      <div>
        <h4>Comments</h4>
        <div>
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={handleComment}>add comment</button>
        </div>
        <ul>
          {blog.comments.map((comment,index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <button onClick={() => handleDelete(blog.id)}>Delete</button>
      </div>
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.object
}

export default Blog
