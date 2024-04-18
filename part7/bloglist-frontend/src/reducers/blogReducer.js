import { createSlice } from '@reduxjs/toolkit'
import blogService  from '../services/blogs'
import { newNotification } from './notificationReducer'
const blogSlice = createSlice({
  name: 'blog',
  initialState: [],
  reducers: {
    set: (state,action) => {
      return action.payload
    },
    add: (state,action) => {
      state.push(action.payload)
    },
    deleteBlog: (state, action) => {
      return state.filter(blog => blog.id !== action.payload)
    },
    update: (state,action) => {
      return state.map(blog => blog.id === action.payload.id ? action.payload.blog  : blog)
    },

  }
})

export const initializeBlogs =  () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(set(blogs))
  }
}

export const addNewBlog = (blog,token,user) => {
  return async dispatch => {
    const result = await blogService.createBlog(blog,token)
    if(!result.data){
      return result
    }
    const newBlog = {
      ...result.data,
      user: {
        id: result.data.user,
        username: user.user
      }
    }
    dispatch(add(newBlog))
    return result
  }
}

export const deleteBlogById = (id, token) => {
  return async dispatch => {
    const result = await blogService.deleteBlog(id,token)
    dispatch(deleteBlog( id ))
    if (result.status !== 204) {
      dispatch(newNotification('already deleted!',5000))
    }
    dispatch(newNotification('Blog eliminado!',5000))
  }
}

export const updateBlog = (blog,token,id) => {
  return async dispatch => {
    const result = await blogService.updateBlog(blog,token,id)
    if (result.data){
      console.log('Update',blog)
      dispatch(update({ id, blog }))
    }
  }
}

export const addComment = (blog, comment) => {
  console.log(comment)
  return async dispatch => {

    const result = await blogService.addComment(blog.id,comment)
    if (result.data){
      dispatch(update({ id: blog.id, blog: { ...blog,comments: result.data.comments } }))
    }
  }
}

const { set,add,update,deleteBlog } = blogSlice.actions
export default blogSlice.reducer