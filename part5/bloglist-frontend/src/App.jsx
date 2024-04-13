import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/loginForm'
import BlogForm from './components/createForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginServices from './services/login'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState({ message: '', status: false })
  const blogRef = useRef()
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const isToken = window.localStorage.getItem('loginToken')
    if (isToken) {
      const user = JSON.parse(isToken)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setError(false)
    }, 5000)
  }, [error])

  const handleLogin = async (e, crendentials) => {
    e.preventDefault()
    try {
      const { data } = await loginServices.loginUser(crendentials)
      if (data.token) {
        setUser(data)
        window.localStorage.setItem('loginToken', JSON.stringify(data))
      }
    } catch (error) {
      setError({ message: error.response.data.error })
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loginToken')
  }

  const addBlog = async (newObject) => {
    const result = await blogService.createBlog(newObject, user.token)
    if (result.data) {
      const newBlog = {
        ...result.data,
        user: {
          id: result.data.user,
          username: user.user
        }
      }
      setBlogs(blogs.concat(newBlog))
      setError({
        message: `a new blog ${result.data.title} by ${result.data.author} added`,
        status: true,
      })
      blogRef.current.toggleVisibility()
    } else {
      setError({ message: result.response.data.error, status: false })
    }
  }

  if (!user) {
    return <LoginForm handleSubmit={handleLogin} error={error} />
  }

  const newBlogForm = () => {
    return (
      <Toggleable label="create new blog" ref={blogRef}>
        <h2>Create new</h2>
        <BlogForm addBlog={addBlog} />
      </Toggleable>
    )
  }

  const handleLike = async (blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    const result = await blogService.updateBlog(newBlog, user.token, blog.id)
    console.log('Result:', result)
    if (result.data) {
      const blogMap = blogs.map((blog) =>
        blog.id === result.data.id ? result.data : blog
      )
      setBlogs(blogMap.sort((a, b) => b.likes - a.likes))
    }
  }

  const handleDelete = async (id) => {
    const result = await blogService.deleteBlog(id, user.token)
    if (result.status !== 204) {
      setError({ message: 'already deleted!', status: false })
    }
    setBlogs(blogs.filter((blog) => blog.id !== id))
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={error.message} status={error.status} />
      <div>
        {user.user} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      {newBlogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
          handleDelete={handleDelete}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
