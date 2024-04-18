import {  useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/loginForm'
import BlogForm from './components/createForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginServices from './services/login'
import Toggleable from './components/Toggleable'
import NotificationContext, { pushNotification } from './reducers/noticationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import UserContext from './reducers/userContext'
import { Link, Route, Routes, useMatch } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Navigation from './components/Navigation'

const App = () => {
  const [notification,dispatchNotification] = useContext(NotificationContext)
  const [user, setUser] = useContext(UserContext)
  const blogRef = useRef()
  const queryClient = useQueryClient()
  let userDetails = useMatch('/users/:id')
  userDetails = userDetails
    ? userDetails.params.id
    : null
  const newBlogMutation = useMutation({
    mutationFn: blogService.createBlog,
    onSuccess: (result) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'],blogs.concat({ ...result.data,user: {
        id: result.data.user,
        username: user.user
      } }
      ))
      pushNotification(dispatchNotification, `a new blog ${result.data.title} by ${result.data.author} added`,true)
      blogRef.current.toggleVisibility()
    },
    onError: (error) => {
      pushNotification(dispatchNotification,error.message)
    }
  })


  const query = useQuery({ queryKey:['blogs'],queryFn: blogService.getAll })
  const blogs = query.data

  const mathBlog = useMatch('/blogs/:id')
  const blog  = mathBlog
    ? blogs?.find(blog => blog.id === mathBlog.params.id)
    : null

  useEffect(() => {
    const isToken = window.localStorage.getItem('loginToken')
    if (isToken) {
      const user = JSON.parse(isToken)
      setUser(user)
    }
  }, [setUser])



  const handleLogin = async (e, crendentials) => {
    e.preventDefault()
    try {
      const { data } = await loginServices.loginUser(crendentials)
      if (data.token) {
        setUser(data)
        window.localStorage.setItem('loginToken', JSON.stringify(data))
      }
    } catch (error) {
      pushNotification(dispatchNotification,error.response.data.error)
    }
  }



  const addBlog = async (newObject) => {
    newBlogMutation.mutate({ data: newObject,token: user.token })
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





  return (
    <div>
      <Navigation />
      <Notification  />
      <h1>Blogs</h1>
      <Routes>
        <Route path='/users' element={<Users />}/>
        <Route path='/users/:id' element={<User id={userDetails} />}/>
        <Route path='/blogs/:id' element={<Blog blog={blog}/>} />
        <Route path='/' element={
          <div>
            {newBlogForm()}
            {blogs?.map(blog => (
              <div key={blog.id}>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </div>
            ))}
          </div>
        }/>
      </Routes>
    </div>
  )
}

export default App
