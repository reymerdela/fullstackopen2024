import { useEffect, useRef } from 'react'
import LoginForm from './components/loginForm'
import BlogForm from './components/createForm'
import Notification from './components/Notification'
import loginServices from './services/login'
import Toggleable from './components/Toggleable'
import { useDispatch, useSelector } from 'react-redux'
import { newNotification } from './reducers/notificationReducer'
import { addNewBlog, deleteBlogById, initializeBlogs, updateBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import { Link } from 'react-router-dom'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'
import { Container, Divider, List, ListItem, ListItemButton, Typography } from '@mui/material'

const App = () => {
  const blogRef = useRef()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const isHome = useMatch('/')

  const math = useMatch('/blogs/:id')
  const blog = math
    ? blogs.find(blog => blog.id === math.params.id)
    : null
  useEffect(() => {
    dispatch(initializeBlogs())
  },[dispatch])

  useEffect(() => {
    const isToken = window.localStorage.getItem('loginToken')
    if (isToken) {
      const user = JSON.parse(isToken)
      dispatch(setUser(user))
    }
  }, [dispatch])



  const handleLogin = async (e, crendentials) => {
    e.preventDefault()
    try {
      const { data } = await loginServices.loginUser(crendentials)
      if (data.token) {
        dispatch(setUser(data))
        window.localStorage.setItem('loginToken', JSON.stringify(data))
      }
    } catch (error) {
      dispatch(newNotification( error.response.data.error ))
    }
  }

  const handleLogout = () => {
    navigate('/')
    dispatch(setUser(null))
    window.localStorage.removeItem('loginToken')
  }

  const addBlog = async (newObject) => {
    const result = await dispatch(addNewBlog(newObject,user.token,user))
    if (result.data) {
      dispatch(newNotification({
        message: `a new blog ${result.data.title} by ${result.data.author} added`,
        status: true,
      }))
      blogRef.current.toggleVisibility()
    } else {
      dispatch(newNotification(result.response.data.error))
    }
  }

  if (!user) {
    return <LoginForm handleSubmit={handleLogin} />
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
      ...blog,
      likes: blog.likes + 1,
    }
    // const result = await blogService.updateBlog(newBlog, user.token, blog.id)
    dispatch(updateBlog(newBlog,user.token,blog.id))
  }

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Desea eliminar la nota?')
    isConfirmed && dispatch(deleteBlogById(id,user.token))
  }

  return (
    <>
      <Navigation handleLogout={handleLogout} user={user.user} />
      <Container maxWidth="lg">
        <Notification />
        <Typography variant='h3' my={2} component="h1">Blogs</Typography>
        { isHome && newBlogForm()}
        <Divider/>
        <Routes>
          <Route path='/users' element={<Users/>}/>
          <Route path='/users/:id' element={<User />}/>
          <Route path='/' element={
            <List sx={{ marginY: '10px' }}>
              {blogs.map(blog => (
                <ListItem key={blog.id} disablePadding>
                  <ListItemButton component={Link} to={`/blogs/${blog.id}`}>{blog.title}</ListItemButton>
                  {/* <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> */}
                </ListItem>
              ))}
            </List>
          }/>
          <Route path='/blogs/:id' element={<BlogView handleDelete={handleDelete} handleLike={handleLike} user={user} blog={blog} />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
